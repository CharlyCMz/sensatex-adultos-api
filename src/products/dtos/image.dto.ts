import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly reference: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productvariantId: string;
}

export class UpdateImageDTO extends PartialType(CreateImageDTO) {}
