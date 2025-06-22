import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInlineProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly quantity: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productVariantId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly sellId?: string;
}

export class UpdateInlineProductDTO extends PartialType(
  CreateInlineProductDTO,
) {}
