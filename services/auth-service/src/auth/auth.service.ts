import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { UserAuth, AuthProvider, UserRole } from '../entities/user-auth.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { MfaSecret, MfaType } from '../entities/mfa-secret.entity';
import { LoginHistory, LoginStatus } from '../entities/login-history.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(MfaSecret)
    private mfaSecretRepository: Repository<MfaSecret>,
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: UserAuth; tokens: any }> {
    const { email, password, phoneNumber, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userAuthRepository.findOne({
      where: [{ email }, ...(phoneNumber ? [{ phoneNumber }] : [])],
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email or phone number');
    }

    // Create new user
    const user = this.userAuthRepository.create({
      email,
      password,
      phoneNumber,
      role: role || UserRole.PATIENT,
      provider: AuthProvider.LOCAL,
      emailVerificationToken: uuidv4(),
    });

    await this.userAuthRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken, registerDto.deviceInfo);

    // Send verification email (implement email service)
    // await this.emailService.sendVerificationEmail(user.email, user.emailVerificationToken);

    return { user, tokens };
  }

  async login(loginDto: LoginDto): Promise<{ user: UserAuth; tokens?: any; mfaRequired?: boolean }> {
    const { email, password } = loginDto;

    // Find user with password
    const user = await this.userAuthRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'mfaEnabled', 'isActive', 'isLocked', 'failedLoginAttempts'],
    });

    if (!user) {
      await this.recordLoginAttempt(null, LoginStatus.FAILED, loginDto.deviceInfo, 'Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      await this.recordLoginAttempt(user.id, LoginStatus.BLOCKED, loginDto.deviceInfo, 'Account locked');
      throw new ForbiddenException('Account is locked');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      await this.recordLoginAttempt(user.id, LoginStatus.FAILED, loginDto.deviceInfo, 'Invalid password');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      await this.recordLoginAttempt(user.id, LoginStatus.MFA_REQUIRED, loginDto.deviceInfo);
      return { user, mfaRequired: true };
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken, loginDto.deviceInfo);

    // Update last login
    user.lastLogin = new Date();
    user.failedLoginAttempts = 0;
    await this.userAuthRepository.save(user);

    // Record successful login
    await this.recordLoginAttempt(user.id, LoginStatus.SUCCESS, loginDto.deviceInfo);

    return { user, tokens };
  }

  async verifyMfa(verifyMfaDto: VerifyMfaDto): Promise<{ user: UserAuth; tokens: any }> {
    const { userId, code, type } = verifyMfaDto;

    const user = await this.userAuthRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const mfaSecret = await this.mfaSecretRepository.findOne({
      where: { userId, type: type || MfaType.TOTP },
      select: ['id', 'secret', 'type'],
    });

    if (!mfaSecret) {
      throw new NotFoundException('MFA not configured');
    }

    // Verify TOTP code
    if (mfaSecret.type === MfaType.TOTP) {
      const verified = speakeasy.totp.verify({
        secret: mfaSecret.secret,
        encoding: 'base32',
        token: code,
        window: 2,
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    // Update MFA usage
    mfaSecret.lastUsed = new Date();
    mfaSecret.useCount++;
    await this.mfaSecretRepository.save(mfaSecret);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken, verifyMfaDto.deviceInfo);

    // Update last login
    user.lastLogin = new Date();
    await this.userAuthRepository.save(user);

    return { user, tokens };
  }

  async setupMfa(userId: string): Promise<{ qrCode: string; secret: string }> {
    const user = await this.userAuthRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `HealthcarePlatform (${user.email})`,
      issuer: 'HealthcarePlatform',
    });

    // Save secret
    const mfaSecret = this.mfaSecretRepository.create({
      userId,
      type: MfaType.TOTP,
      secret: secret.base32,
    });
    await this.mfaSecretRepository.save(mfaSecret);

    // Generate QR code
    const qrCode = secret.otpauth_url ? await QRCode.toDataURL(secret.otpauth_url) : '';

    return { qrCode, secret: secret.base32 };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ tokens: any }> {
    const { refreshToken } = refreshTokenDto;

    // Find refresh token
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(tokenEntity.user);

    // Revoke old refresh token
    tokenEntity.isRevoked = true;
    tokenEntity.revokedAt = new Date();
    await this.refreshTokenRepository.save(tokenEntity);

    // Save new refresh token
    await this.saveRefreshToken(tokenEntity.userId, tokens.refreshToken, refreshTokenDto.deviceInfo);

    return { tokens };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific token
      await this.refreshTokenRepository.update(
        { token: refreshToken, userId },
        { isRevoked: true, revokedAt: new Date(), revokedReason: 'User logout' },
      );
    } else {
      // Revoke all tokens for user
      await this.refreshTokenRepository.update(
        { userId, isRevoked: false },
        { isRevoked: true, revokedAt: new Date(), revokedReason: 'User logout all devices' },
      );
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userAuthRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    user.passwordResetToken = await bcrypt.hash(resetToken, 10);
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.userAuthRepository.save(user);

    // Send reset email (implement email service)
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    const users = await this.userAuthRepository.find({
      where: { passwordResetToken: Not(IsNull()) },
    });

    // Find user with matching token
    let user: UserAuth | null = null;
    for (const u of users) {
      if (await bcrypt.compare(token, u.passwordResetToken!)) {
        user = u;
        break;
      }
    }

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.lastPasswordChange = new Date();

    await this.userAuthRepository.save(user);
  }

  private async generateTokens(user: UserAuth): Promise<any> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  private async saveRefreshToken(
    userId: string,
    token: string,
    deviceInfo?: any,
  ): Promise<void> {
    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      deviceId: deviceInfo?.deviceId,
      deviceName: deviceInfo?.deviceName,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

  private async recordLoginAttempt(
    userId: string | null,
    status: LoginStatus,
    deviceInfo?: any,
    failureReason?: string,
  ): Promise<void> {
    const loginHistory = this.loginHistoryRepository.create({
      userId: userId || 'unknown',
      status,
      ipAddress: deviceInfo?.ipAddress || 'unknown',
      userAgent: deviceInfo?.userAgent,
      deviceFingerprint: deviceInfo?.deviceFingerprint,
      failureReason,
    });

    await this.loginHistoryRepository.save(loginHistory);
  }

  private async handleFailedLogin(user: UserAuth): Promise<void> {
    user.failedLoginAttempts++;

    // Lock account after 5 failed attempts
    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
      user.lockReason = 'Too many failed login attempts';
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }

    await this.userAuthRepository.save(user);
  }
}