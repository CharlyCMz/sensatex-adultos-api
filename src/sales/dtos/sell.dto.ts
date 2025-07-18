import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateAddressDTO } from 'src/users/dtos/address.dto';
import { CreatePersonDTO } from 'src/users/dtos/person.dto';
import { CreateInlineProductDTO } from './inline-product.dto';

export class CreateSellDTO {
  @IsNotEmpty()
  @ApiProperty({ type: CreatePersonDTO })
  readonly person: CreatePersonDTO;

  @IsOptional()
  @ApiProperty({ type: CreateAddressDTO || null })
  readonly billingAddress?: CreateAddressDTO;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [CreateInlineProductDTO] })
  readonly inlineProducts: CreateInlineProductDTO[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly notes?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly transporter?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly transporterTracking?: string;
}

export class UpdateSellDTO extends PartialType(CreateSellDTO) {}

export class AdminUpdateSellDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  transporter?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  transporterTracking?: string;
}
