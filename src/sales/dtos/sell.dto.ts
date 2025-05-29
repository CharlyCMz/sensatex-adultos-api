import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSellDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly billingAddressId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly shippingAddressId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly personId: string;
}

export class UpdateSellDTO extends PartialType(CreateSellDTO) {}
