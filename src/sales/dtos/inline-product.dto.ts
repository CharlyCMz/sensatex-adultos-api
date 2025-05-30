import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInlineProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly quantity: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly sellId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productvariantId: string;
}

export class UpdateInlineProductDTO extends PartialType(
  CreateInlineProductDTO,
) {}
