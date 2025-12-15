import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from '../roles/schemas/role.schema';
import { SignupDto } from '../auth/dto/signup.dto';
import { RolesService } from '../roles/roles.service';
import { UserProfileDto } from '../auth/dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly rolesService: RolesService,
  ) {}

  async create(signupDto: SignupDto): Promise<UserDocument> {
    // Check if username exists
    const existingUserByUsername = await this.userModel.findOne({
      username: signupDto.username,
    });
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email exists
    const existingUserByEmail = await this.userModel.findOne({
      email: signupDto.email,
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // Validate password confirmation
    if (signupDto.password !== signupDto.passwordConfirmation) {
      throw new ConflictException('Passwords do not match');
    }

    // Get role with features
    const role = await this.rolesService.findByName(signupDto.role);
    if (!role) {
      throw new NotFoundException(`Role ${signupDto.role} not found`);
    }

    // Create user
    const user = new this.userModel({
      firstName: signupDto.firstName,
      lastName: signupDto.lastName,
      username: signupDto.username,
      email: signupDto.email,
      password: signupDto.password, // Will be hashed by pre-save hook
      dateOfBirth: signupDto.dateOfBirth
        ? new Date(signupDto.dateOfBirth)
        : undefined,
      phoneNumber: signupDto.phoneNumber,
      location: signupDto.location || {},
      role: signupDto.role,
      roles: [role._id],
    });

    return user.save();
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      })
      .populate('roles')
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .populate('roles')
      .exec();
  }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const features = await this.rolesService.getFeaturesByRole(user.role);

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
      location: user.location,
      role: user.role,
      features,
    };
  }
}

