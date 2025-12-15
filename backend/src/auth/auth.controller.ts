import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(signupDto);
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Remove refreshToken from response body
    const { refreshToken, ...response } = result;
    return response;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Remove refreshToken from response body
    const { refreshToken, ...response } = result;
    return response;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(user.id);
    // Update refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Remove refreshToken from response body
    const { refreshToken, ...response } = result;
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: UserDocument) {
    return this.authService.getProfile(user.id);
  }
}

