import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class WebhookDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  resource?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  action?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  api_version?: string;

  @ApiProperty()
  @IsOptional()
  data?: {
    id: string;
  };

  @ApiProperty()
  @IsString()
  @IsOptional()
  date_created?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  live_mode?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  user_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  applicationId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  approvedAmount?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  statusTimestamp?: string;
}
