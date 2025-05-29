import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly personId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly roleId: number;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
