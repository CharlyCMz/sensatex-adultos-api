import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVariantAttributeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly value: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly attributeId: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly productVariantId?: string;
}

export class UpdateVariantAttributeDTO extends PartialType(
  CreateVariantAttributeDTO,
) {}
