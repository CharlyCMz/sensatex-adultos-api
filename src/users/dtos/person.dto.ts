import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateAddressDTO } from './address.dto';

export class CreatePersonDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly docTypeId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly document: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly midname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly lastname1: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly lastname2: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly mail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly phone: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly address: CreateAddressDTO;
}

export class UpdatePersonDTO extends PartialType(CreatePersonDTO) {}
