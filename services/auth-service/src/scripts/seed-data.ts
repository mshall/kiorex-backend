import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserAuth, UserRole, AuthProvider } from '../entities/user-auth.entity';
import { MfaSecret, MfaType } from '../entities/mfa-secret.entity';
import { LoginHistory, LoginStatus } from '../entities/login-history.entity';
import * as speakeasy from 'speakeasy';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'auth_db',
  entities: [UserAuth, MfaSecret, LoginHistory],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const userAuthRepo = dataSource.getRepository(UserAuth);
  const mfaSecretRepo = dataSource.getRepository(MfaSecret);
  const loginHistoryRepo = dataSource.getRepository(LoginHistory);

  // Clear existing data
  await loginHistoryRepo.delete({});
  await mfaSecretRepo.delete({});
  await userAuthRepo.delete({});

  console.log('Existing data cleared');

  // Create test users
  const users = [
    {
      email: 'admin@healthcare.com',
      password: 'Admin@123456',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
      phoneNumber: '+1234567890',
      phoneVerified: true,
      mfaEnabled: true,
    },
    {
      email: 'doctor1@healthcare.com',
      password: 'Doctor@123456',
      role: UserRole.DOCTOR,
      emailVerified: true,
      phoneNumber: '+1234567891',
      phoneVerified: true,
      mfaEnabled: false,
    },
    {
      email: 'doctor2@healthcare.com',
      password: 'Doctor@123456',
      role: UserRole.DOCTOR,
      emailVerified: true,
      phoneNumber: '+1234567892',
      phoneVerified: true,
      mfaEnabled: true,
    },
    {
      email: 'nurse1@healthcare.com',
      password: 'Nurse@123456',
      role: UserRole.NURSE,
      emailVerified: true,
      phoneNumber: '+1234567893',
      phoneVerified: true,
      mfaEnabled: false,
    },
    {
      email: 'staff1@healthcare.com',
      password: 'Staff@123456',
      role: UserRole.STAFF,
      emailVerified: true,
      phoneNumber: '+1234567894',
      phoneVerified: false,
      mfaEnabled: false,
    },
  ];

  // Create patients
  for (let i = 1; i <= 50; i++) {
    users.push({
      email: `patient${i}@example.com`,
      password: 'Patient@123456',
      role: UserRole.PATIENT,
      emailVerified: i % 2 === 0,
      phoneNumber: `+123456789${i.toString().padStart(2, '0')}`,
      phoneVerified: i % 3 === 0,
      mfaEnabled: i % 5 === 0,
    });
  }

  const createdUsers: UserAuth[] = [];
  
  for (const userData of users) {
    const user = userAuthRepo.create({
      ...userData,
      provider: AuthProvider.LOCAL,
      isActive: true,
      permissions: userData.role === UserRole.SUPER_ADMIN 
        ? ['admin:*', 'user:*', 'appointment:*', 'clinical:*', 'payment:*']
        : userData.role === UserRole.DOCTOR
        ? ['appointment:read', 'appointment:write', 'clinical:read', 'clinical:write', 'user:read']
        : userData.role === UserRole.NURSE
        ? ['appointment:read', 'clinical:read', 'clinical:write', 'user:read']
        : userData.role === UserRole.STAFF
        ? ['appointment:read', 'appointment:write', 'user:read']
        : ['appointment:read', 'appointment:write:own', 'clinical:read:own', 'payment:read:own'],
      metadata: {
        createdFrom: 'seed-script',
        environment: 'development',
      },
    });

    const savedUser = await userAuthRepo.save(user);
    createdUsers.push(savedUser);

    // Add MFA secrets for users with MFA enabled
    if (userData.mfaEnabled) {
      const secret = speakeasy.generateSecret({
        name: `HealthcarePlatform (${userData.email})`,
        issuer: 'HealthcarePlatform',
      });

      const mfaSecret = mfaSecretRepo.create({
        userId: savedUser.id,
        type: MfaType.TOTP,
        secret: secret.base32,
        isVerified: true,
        verifiedAt: new Date(),
        backupCodes: Array.from({ length: 10 }, () => 
          Math.random().toString(36).substring(2, 8).toUpperCase()
        ),
      });

      await mfaSecretRepo.save(mfaSecret);
    }

    // Add login history
    const historyCount = Math.floor(Math.random() * 10) + 5;
    for (let j = 0; j < historyCount; j++) {
      const loginHistory = loginHistoryRepo.create({
        userId: savedUser.id,
        status: j === 0 ? LoginStatus.FAILED : LoginStatus.SUCCESS,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: 'New York, USA',
        country: 'United States',
        city: 'New York',
        deviceFingerprint: uuidv4(),
        sessionId: j > 0 ? uuidv4() : undefined,
        createdAt: new Date(Date.now() - j * 24 * 60 * 60 * 1000), // Past days
      });

      await loginHistoryRepo.save(loginHistory);
    }
  }

  console.log(`Created ${createdUsers.length} users`);

  // Create some OAuth users
  const oauthUsers = [
    {
      email: 'google.user@gmail.com',
      provider: AuthProvider.GOOGLE,
      providerId: 'google-123456',
      role: UserRole.PATIENT,
      emailVerified: true,
    },
    {
      email: 'facebook.user@facebook.com',
      provider: AuthProvider.FACEBOOK,
      providerId: 'facebook-789012',
      role: UserRole.PATIENT,
      emailVerified: true,
    },
  ];

  for (const oauthData of oauthUsers) {
    const oauthUser = userAuthRepo.create({
      ...oauthData,
      isActive: true,
      permissions: ['appointment:read', 'appointment:write:own', 'clinical:read:own'],
    });

    await userAuthRepo.save(oauthUser);
  }

  console.log('OAuth users created');

  // Display sample credentials
  console.log('\n=== Sample Login Credentials ===');
  console.log('Admin: admin@healthcare.com / Admin@123456 (MFA enabled)');
  console.log('Doctor: doctor1@healthcare.com / Doctor@123456');
  console.log('Nurse: nurse1@healthcare.com / Nurse@123456');
  console.log('Patient: patient1@example.com / Patient@123456');
  console.log('================================\n');

  await dataSource.destroy();
  console.log('Seed completed successfully');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});