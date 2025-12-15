export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  USER = 'user',
}

export interface Location {
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  location?: Location;
  role: UserRole;
  features: string[];
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  location?: Location;
  role: UserRole;
}

export interface LoginData {
  usernameOrEmail: string;
  password: string;
}

