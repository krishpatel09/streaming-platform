import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required.' })
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits.' })
  code!: string;

  @IsString()
  @IsNotEmpty({ message: 'Verification purpose is required.' })
  purpose!: string;
}
