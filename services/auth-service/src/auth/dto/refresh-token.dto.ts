import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiPropertyOptional()
  @IsOptional()
  deviceInfo?: {
    deviceId?: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}