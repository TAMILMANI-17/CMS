import { UserRole } from '../../roles/schemas/role.schema';

export class UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
  };
  role: UserRole;
  features: string[];
}

export class AuthResponseDto {
  user: UserProfileDto;
  accessToken: string;
}

