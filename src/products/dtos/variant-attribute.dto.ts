import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVariantAttributeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly value: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly attributeId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productvariantId: string;
}

export class UpdateVariantAttributeDTO extends PartialType(
  CreateVariantAttributeDTO,
) {}
