import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<AuthResponseDto & { refreshToken: string }> {
    try {
      const user = await this.usersService.create(signupDto);
      const features = await this.rolesService.getFeaturesByRole(user.role);

      const tokens = await this.generateTokens(user._id, user.email);

      await this.usersService.updateRefreshToken(
        user._id.toString(),
        tokens.refreshToken,
      );

      return {
        user: {
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
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Failed to create user');
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<AuthResponseDto & { refreshToken: string }> {
    const user = await this.usersService.validateUser(
      loginDto.usernameOrEmail,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const features = await this.rolesService.getFeaturesByRole(user.role);
    const tokens = await this.generateTokens(user._id, user.email);

    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return {
      user: {
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
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshToken(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      tokens.refreshToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    return this.usersService.getUserProfile(userId);
  }

  private async generateTokens(
    userId: string | { toString(): string },
    email: string,
  ) {
    const userIdString =
      typeof userId === 'string' ? userId : userId.toString();
    const payload = { sub: userIdString, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}

