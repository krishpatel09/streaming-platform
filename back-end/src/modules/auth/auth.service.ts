import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { MailService } from './services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      const { email, password, username } = signupDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('email already exists.');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          username,
          isVerified: false,
          profiles: {
            create: {
              username,
              isKid: false,
            },
          },
        },
        include: {
          profiles: true,
        },
      });

      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete existing OTPs for signup purpose for this email
      await this.prisma.otp.deleteMany({
        where: { email, purpose: 'SIGNUP' },
      });

      // Store OTP
      await this.prisma.otp.create({
        data: {
          email,
          code: otpCode,
          purpose: 'SIGNUP',
          expiresAt,
        },
      });

      // Send OTP via MailService
      await this.mailService.sendVerificationEmail(email, username, otpCode);

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Signup failed.',
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email address before logging in.');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        ...tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Login failed.',
      );
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const { email, code, purpose } = verifyOtpDto;

      const otpRecord = await this.prisma.otp.findFirst({
        where: {
          email,
          code,
          purpose,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpRecord) {
        throw new UnauthorizedException('Invalid or expired verification code.');
      }

      // Delete the OTP code
      await this.prisma.otp.deleteMany({
        where: { email, purpose },
      });

      // Update user isVerified status
      const user = await this.prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });

      // Generate login tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        ...tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Verification failed.',
      );
    }
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    try {
      const { email, purpose } = resendOtpDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      // Delete existing OTPs for this purpose
      await this.prisma.otp.deleteMany({
        where: { email, purpose },
      });

      // Generate new OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store new OTP
      await this.prisma.otp.create({
        data: {
          email,
          code: otpCode,
          purpose,
          expiresAt,
        },
      });

      // Send email
      await this.mailService.sendVerificationEmail(email, user.username, otpCode);

      return {
        message: 'Verification code resent successfully.',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to resend verification code.',
      );
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })) as unknown as { sub: string; email: string; role: string };

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    try {
      const payload = { sub: userId, email, role };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to generate tokens.',
      );
    }
  }
}
