import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePersonDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly docTypeId: number;

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
}

export class UpdatePersonDTO extends PartialType(CreatePersonDTO) {}
