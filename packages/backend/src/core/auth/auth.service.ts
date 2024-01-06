import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { encrypt, decrypt } from '../../helpers/crypto';
import AuthRepository from '../../infrastructure/database/repositories/auth.repository';
import { UserDto } from './entities/dtos/auth.dto';
import { EXCEPTION } from '../../common/constants';
import { TokenService } from './token.service';
import { ServerResponse, Tokens } from '../../common/types';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  public constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService
  ) {}

  public async signUp(body: UserDto): Promise<ServerResponse> {
    const user = await this.findUser(body.email);
    if (user) {
      throw new BadRequestException(EXCEPTION.USER_ALREADY_EXISTS);
    }
    const hash = await encrypt(body.password);

    const createdUser = await this.authRepository.create({
      ...body,
      password: hash
    });

    const tokens = await this.tokenService.getTokens(createdUser.id, createdUser.email);
    await this.tokenService.updateRefreshToken(createdUser.id, tokens.refreshToken);
    return { status: HttpStatus.CREATED, message: 'User was successfully created', data: tokens };
  }

  public async findUser(email: string): Promise<User> {
    return await this.authRepository.find(email);
  }

  public async signIn({ email, password }: UserDto): Promise<ServerResponse> {
    const user = await this.findUser(email);
    if (!user) {
      throw new BadRequestException(EXCEPTION.USER_NOT_FOUND);
    }

    const verifyPassword = await decrypt(user.password, password);

    if (verifyPassword) {
      throw new BadRequestException(EXCEPTION.PASSWORD_INCORRECT);
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);
    await this.tokenService.updateRefreshToken(user.id, tokens.refreshToken);
    return { status: HttpStatus.OK, message: 'User was successfully logged', data: tokens };
  }

  public async logout(id: string): Promise<ServerResponse> {
    await this.authRepository.updateToken(id, null);

    return {
      status: HttpStatus.OK,
      message: 'User was successfully logged out',
      data: null
    };
  }

  public async refreshTokens(email: string, refreshToken: string): Promise<ServerResponse> {
    const user = await this.findUser(email);
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
}
