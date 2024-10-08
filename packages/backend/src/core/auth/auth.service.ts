import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import {
  RegisterUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordQueriesDto
} from '@core/auth/entities/dtos/auth.dto';
import { TokenService } from '@core/auth/token.service';
import { ProducerService } from '@core/queue/producer.service';
import UserRepository from '@infrastructure/database/repositories/user.repository';
import { encrypt, decrypt } from '@common/helpers/crypto.helper';
import { APP, EXCEPTION } from '@common/constants';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly producerService: ProducerService,
    private readonly configService: ConfigService
  ) {}

  public async signUp({ email, username, password }: RegisterUserDto) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new BadRequestException(EXCEPTION.USER_ALREADY_EXISTS);
    }

    const hash = await encrypt(password);

    const createdUser = await this.userRepository.create({
      email,
      username,
      password: hash
    });

    await this.producerService.pushMessageToEmailQueue({
      email: createdUser.email,
      subject: `Welcome to our community, ${createdUser.username}!`,
      html: `<p>Hello ${createdUser.username},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>Enjoy your time with us!</p>`
    });

    const tokens = await this.tokenService.getTokens(createdUser.id, createdUser.email);
    await this.tokenService.updateRefreshToken(createdUser.id, tokens.refreshToken);

    return { status: HttpStatus.CREATED, message: 'User was successfully created', data: tokens };
  }

  public async signIn({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    const verifyPassword = await decrypt(user.password, password);

    if (verifyPassword) {
      throw new BadRequestException(EXCEPTION.PASSWORD_INCORRECT);
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);
    return { status: HttpStatus.OK, message: 'User was successfully logged', data: tokens };
  }

  public async logout(id: string) {
    await this.userRepository.updateRefreshToken(id, null);

    return {
      status: HttpStatus.OK,
      message: 'User was successfully logged out',
      data: null
    };
  }

  public async refreshTokens(email: string, refreshToken: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException(EXCEPTION.ACCESS_DENIED);
    }

    const refreshTokenMatches = decrypt(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException(EXCEPTION.ACCESS_DENIED);
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);
    return { status: HttpStatus.OK, message: 'Tokens was successfully updated', data: tokens };
  }

  public async forgotPassword({ email }: ForgotPasswordDto) {
    const url = this.configService.get('APP_URL');

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    const resetToken = randomBytes(32).toString();
    const hashedResetToken = await encrypt(resetToken);
    const link = `${url}/${APP.GLOBAL_PREFIX}/password-reset?token=${hashedResetToken}&id=${user.id}`;

    await this.userRepository.updateResetToken(user.id, hashedResetToken);

    await this.producerService.pushMessageToEmailQueue({
      email,
      subject: 'Password reset',
      html: `<p>Click <a href="${link}">here</a> to reset your password</p>`
    });

    return {
      status: HttpStatus.OK,
      message: 'Password reset link was successfully sent',
      data: null
    };
  }

  public async resetPassword({ id, token }: ResetPasswordQueriesDto) {
    const user = await this.userRepository.findByEmail(id);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    const resetToken = await decrypt(user.resetToken, token);

    if (!resetToken) {
      throw new ForbiddenException(EXCEPTION.ACCESS_DENIED);
    }

    const password = Math.random().toString(36).slice(-8);
    await this.userRepository.updatePassword(user.email, password);

    await this.producerService.pushMessageToEmailQueue({
      email: user.email,
      subject: 'Password reset',
      html: `<p>Your new password is ${password}.</p><p>Change it as soon as you can.</p>`
    });

    return {
      status: HttpStatus.OK,
      message: 'Password was successfully reset',
      data: null
    };
  }
}
