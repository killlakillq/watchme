import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserDto } from '../../core/auth/entities/dtos/auth.dto';
import { Request, Response } from 'express';
import { ServerResponse } from '../../common/types';
import { JwtAccessGuard } from '../../common/guards/access-token.guard';
import { JwtRefreshGuard } from '../../common/guards/refresh-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
  responseSchema,
  notFoundSchema,
  internalServerErrorSchema,
  unauthorizedSchema,
  forbiddenSchema
} from '../../common/documents';
import { AuthService } from '../../core/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Register user' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async signUp(
    @Body() body: UserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.authService.signUp(body);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Post('/signin')
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Login user' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async signIn(
    @Body() body: UserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.authService.signIn(body);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Get('/refresh')
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiForbiddenResponse(forbiddenSchema)
  @ApiOperation({ summary: "Update user's tokens" })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async updateTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const id = req.user['email'];
    const refreshToken = req.user['refreshToken'];
    const { status, message, data } = await this.authService.refreshTokens(id, refreshToken);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Post('/logout')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'User logout' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const user = req.user['sub'];
    const { status, message, data } = await this.authService.logout(user);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }
}
