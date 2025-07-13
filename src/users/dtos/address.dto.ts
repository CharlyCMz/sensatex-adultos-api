import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly reference: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly suit?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly zipCode?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly isBilling: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly isShipping: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly locationId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly personId?: string;
}

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {}
