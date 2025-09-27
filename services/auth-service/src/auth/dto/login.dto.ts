import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  deviceInfo?: {
    deviceId?: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceFingerprint?: string;
  };
}