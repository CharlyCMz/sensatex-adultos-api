import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly countryCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly countryName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly stateCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly stateName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly cityCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly cityName: string;
}

export class UpdateLocationDTO extends PartialType(CreateLocationDTO) {}
