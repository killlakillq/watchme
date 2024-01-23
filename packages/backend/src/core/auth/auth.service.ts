import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { encrypt, decrypt } from '../../helpers/crypto.helper';
import AuthRepository from '../../infrastructure/database/repositories/auth.repository';
import { UserDto } from './entities/dtos/auth.dto';
import { APP, EXCEPTIONS } from '../../common/constants';
import { TokenService } from './token.service';
import { ServerResponse } from '../../common/types';
import { ProducerService } from '../queue/producer.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly producerService: ProducerService
  ) {}

  public async signUp(body: UserDto): Promise<ServerResponse> {
    const user = await this.authRepository.findUserByEmail(body.email);
    if (user) {
      throw new BadRequestException(EXCEPTIONS.USER_ALREADY_EXISTS);
    }
    const hash = await encrypt(body.password);

    const createdUser = await this.authRepository.create({
      ...body,
      password: hash
    });

    await this.producerService.pushMessageToEmailQueue({
      email: 'mdraginich@gmail.com',
      subject: `Welcome to our community, ${user.firstName}!`,
      html: `<p>Hello ${user.firstName},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>Enjoy your time with us!</p>`
    });

    const tokens = await this.tokenService.getTokens(createdUser.id, createdUser.email);
    await this.tokenService.updateRefreshToken(createdUser.id, tokens.refreshToken);

    return { status: HttpStatus.CREATED, message: 'User was successfully created', data: tokens };
  }

  public async signIn({ email, password }: UserDto): Promise<ServerResponse> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(EXCEPTIONS.USER_NOT_FOUND);
    }

    const verifyPassword = await decrypt(user.password, password);

    if (verifyPassword) {
      throw new BadRequestException(EXCEPTIONS.PASSWORD_INCORRECT);
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);
    return { status: HttpStatus.OK, message: 'User was successfully logged', data: tokens };
  }

  public async logout(id: string): Promise<ServerResponse> {
    await this.authRepository.updateRefreshToken(id, null);

    return {
      status: HttpStatus.OK,
      message: 'User was successfully logged out',
      data: null
    };
  }

  public async refreshTokens(email: string, refreshToken: string): Promise<ServerResponse> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException(EXCEPTIONS.ACCESS_DENIED);
    }

    const refreshTokenMatches = decrypt(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException(EXCEPTIONS.ACCESS_DENIED);
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);
    return { status: HttpStatus.OK, message: 'Tokens was successfully updated', data: tokens };
  }

  public async forgotPassword(email: string): Promise<ServerResponse> {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(EXCEPTIONS.USER_NOT_FOUND);
    }
    const resetToken = randomBytes(32).toString();

    const hashedResetToken = await encrypt(resetToken);

    const link = `${APP.URL}/${APP.GLOBAL_PREFIX}/password-reset?token=${hashedResetToken}&id=${user.id}`;

    await this.authRepository.updateResetToken(user.id, hashedResetToken);

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

  public async resetPassword(id: string, token: string): Promise<ServerResponse> {
    const user = await this.authRepository.findUserById(id);
    if (!user) {
      throw new BadRequestException(EXCEPTIONS.USER_NOT_FOUND);
    }

    const resetToken = await decrypt(user.resetToken, token);

    if (!resetToken) {
      throw new ForbiddenException(EXCEPTIONS.ACCESS_DENIED);
    }

    const password = Math.random().toString(36).slice(-8);
    await this.authRepository.updatePassword(user.email, password);

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
