import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreatePersonDTO } from './person.dto';

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
  @ApiProperty()
  readonly person: CreatePersonDTO;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly roleId: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
