import { PrismaClient } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserMethods } from '@core/auth/entities/user.entity';
import { UserDto } from '@core/auth/entities/dtos/auth.dto';

@Injectable()
export default class UserRepository implements UserMethods {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(data: UserDto): Promise<User> {
    return this.prisma.user
      .create({
        data
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async findByEmail(email: string): Promise<User> {
    return this.prisma.user
      .findUnique({
        where: {
          email
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async findById(id: string): Promise<User> {
    return this.prisma.user
      .findUnique({
        where: {
          id
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async updateRefreshToken(id: string, token: string): Promise<User> {
    return this.prisma.user
      .update({
        where: { id },
        data: {
          refreshToken: token
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async updateResetToken(id: string, token: string): Promise<User> {
    return this.prisma.user
      .update({
        where: { id },
        data: {
          resetToken: token
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async updatePassword(email: string, password: string): Promise<User> {
    return this.prisma.user
      .update({
        where: { email },
        data: {
          password
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
