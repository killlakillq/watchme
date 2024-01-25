import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { User, UserMethods } from '../../../core/auth/entities/user.entity';
import { UserDto } from '../../../core/auth/entities/dtos/auth.dto';

@Injectable()
export default class UserRepository implements UserMethods {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(data: UserDto): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  public async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  public async findUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  public async updateRefreshToken(id: string, token: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: token
      }
    });
  }

  public async updateResetToken(id: string, token: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        resetToken: token
      }
    });
  }

  public async updatePassword(email: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: {
        password
      }
    });
  }
}
