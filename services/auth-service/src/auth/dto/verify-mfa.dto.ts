import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MfaType } from '../../entities/mfa-secret.entity';

export class VerifyMfaDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ enum: MfaType })
  @IsOptional()
  @IsEnum(MfaType)
  type?: MfaType;

  @ApiPropertyOptional()
  @IsOptional()
  deviceInfo?: {
    deviceId?: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}