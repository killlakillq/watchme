/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import 'express';

declare module 'express' {
  export interface Request {
    user: {
      username: string;
      id: string;
      email: string;
      refreshToken: string;
      provider: string;
      picture: string;
    };
  }
}

export enum MovieList {
  now_playing = 'now_playing',
  popular = 'popular',
  top_rated = 'top_rated',
  upcoming = 'upcoming'
}

export class ServerResponse<T> {
  @ApiProperty({ example: '201' })
  status: number;

  @ApiProperty({ example: 'Name of movie was successfully fetched' })
  message: string;

  @ApiProperty({ example: { id: 1, title: 'title', description: 'description' } })
  data: T;
}

export interface PostgresOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export type JwtPayload = {
  id: string;
  email: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export interface LogsDto {
  level: string;
  timestamp: string;
  message: string;
  method: string;
  path: string;
  userAgent: string;
}

export interface EmailMessageOptions {
  email: string;
  subject: string;
  html: string;
}
