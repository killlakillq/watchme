import { HttpStatus, Injectable } from '@nestjs/common';
import UserRepository from '../../infrastructure/database/repositories/user.repository';
import { OAuthUserDto } from './entities/dtos/auth.dto';
import { TokenService } from './token.service';
import { ServerResponse } from '../../common/types';

@Injectable()
export class OpenService {
  public constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository
  ) {}

  public async signIn({ id, email, username, picture }: OAuthUserDto): Promise<ServerResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      await this.signUp({
        id,
        email,
        username,
        picture
      });
    }

    const tokens = await this.tokenService.getTokens(user.id, user.email);

    return {
      status: HttpStatus.OK,
      message: 'User was successfully logged',
      data: tokens
    };
  }

  public async signUp(body: OAuthUserDto): Promise<ServerResponse> {
    const { id, email } = await this.userRepository.create(body);

    const tokens = await this.tokenService.getTokens(id, email);

    return {
      status: HttpStatus.CREATED,
      message: 'User was successfully created',
      data: tokens
    };
  }
}
