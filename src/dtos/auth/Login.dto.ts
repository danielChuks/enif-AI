import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(10)
  password: string;
}
