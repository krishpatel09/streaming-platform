import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend | null = null;
  private fromEmail: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';

    if (apiKey && apiKey !== 'placeholder' && !apiKey.startsWith('your_')) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY is not configured. Falling back to console logging for OTPs.');
    }
  }

  async sendVerificationEmail(email: string, username: string, code: string): Promise<void> {
    const subject = 'Verify your Account - Streaming Platform';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px; background-color: #ffffff; color: #18181b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #e11d48; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">STREAMING PLATFORM</h2>
        </div>
        <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Hi ${username},</h3>
        <p style="font-size: 16px; line-height: 24px; color: #71717a; margin-bottom: 24px;">
          Thank you for signing up! Use the verification code below to confirm your email and complete your registration. This code will expire in 10 minutes.
        </p>
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #18181b; background-color: #f4f4f5; padding: 12px 24px; border-radius: 6px; border: 1px solid #e4e4e7;">
            ${code}
          </span>
        </div>
        <p style="font-size: 14px; line-height: 20px; color: #a1a1aa; margin-top: 32px; border-top: 1px solid #f4f4f5; padding-top: 16px;">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    `;

    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.fromEmail,
          to: email,
          subject,
          html: htmlContent,
        });
        this.logger.log(`Verification email sent successfully to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send email via Resend to ${email}:`, error);
        this.logCodeToConsole(email, code);
      }
    } else {
      this.logCodeToConsole(email, code);
    }
  }

  private logCodeToConsole(email: string, code: string): void {
    const border = '='.repeat(60);
    this.logger.log(
      `\n${border}\n` +
      `  [LOCAL DEVELOPMENT] OTP verification email simulated:\n` +
      `  To:      ${email}\n` +
      `  Code:    ${code}\n` +
      `  Expires: 10 minutes\n` +
      `${border}\n`
    );
  }
}
