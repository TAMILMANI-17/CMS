import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../roles/schemas/role.schema';

class LocationDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  pincode?: string;
}

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirmation: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

