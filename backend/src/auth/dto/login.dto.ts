import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  usernameOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

