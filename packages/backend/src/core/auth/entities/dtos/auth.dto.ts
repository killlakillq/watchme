/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;
}

export class LoginUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string;
}

export class OAuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  picture?: string;

  @ApiProperty()
  email: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  token: string;
}
