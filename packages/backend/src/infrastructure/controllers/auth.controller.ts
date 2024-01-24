import { Body, Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UserDto } from '../../core/auth/entities/dtos/auth.dto';
import { ServerResponse } from '../../common/types';
import { JwtAccessGuard } from '../../common/guards/access-token.guard';
import { JwtRefreshGuard } from '../../common/guards/refresh-token.guard';
import {
  responseSchema,
  notFoundSchema,
  internalServerErrorSchema,
  unauthorizedSchema,
  forbiddenSchema
} from '../../common/documents';
import { AuthService } from '../../core/auth/auth.service';
import { GoogleGuard } from '../../common/guards/google.guard';
import { OpenService } from '../../core/auth/open.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly openService: OpenService
  ) {}

  @Post('/signup')
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Register user' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async signUp(@Body() body: UserDto): Promise<ServerResponse> {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  @ApiBody({ type: UserDto })
  @ApiOkResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Login user' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async signIn(@Body() body: UserDto): Promise<ServerResponse> {
    return this.authService.signIn(body);
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
  public async updateTokens(@Req() req: Request): Promise<ServerResponse> {
    const { email } = req.user;
    const { refreshToken } = req.user;
    return this.authService.refreshTokens(email, refreshToken);
  }

  @Post('/forgot-password')
  @ApiOkResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiForbiddenResponse(forbiddenSchema)
  @ApiOperation({ summary: 'Request reset password' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async forgotPassword(@Body() email: string): Promise<ServerResponse> {
    return this.authService.forgotPassword(email);
  }

  @Get('reset-password')
  @ApiOkResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiForbiddenResponse(forbiddenSchema)
  @ApiOperation({ summary: 'Request reset password' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async resetPassword(@Query() id: string, @Query() token: string): Promise<ServerResponse> {
    return this.authService.resetPassword(id, token);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiOkResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'User logout' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  public async logout(@Req() req: Request): Promise<ServerResponse> {
    const { id } = req.user;
    return this.authService.logout(id);
  }

  @Redirect('/')
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiOperation({ summary: 'Google auth' })
  public async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const { user } = req;

    const { status, data, message } = await this.openService.signIn({
      id: user.id,
      email: user.email,
      username: user.username,
      picture: user.picture
    });

    res.cookie('access_token', data.accessToken, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false
    });

    return {
      status,
      message,
      data
    };
  }
}
