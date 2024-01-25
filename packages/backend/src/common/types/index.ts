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

export class MovieList {
  now_playing: string;

  popular: string;

  top_rated: string;

  upcoming: string;
}

export class ServerResponse {
  @ApiProperty({ example: '201' })
  status: number;

  @ApiProperty({ example: 'Name of movie was successfully fetched' })
  message: string;

  @ApiProperty({ example: { id: 1, title: 'title', description: 'description' } })
  data: any;
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
