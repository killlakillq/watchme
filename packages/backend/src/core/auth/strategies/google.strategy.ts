import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GOOGLE } from '../../../common/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  public constructor() {
    super({
      clientID: GOOGLE.CLIENT_ID,
      clientSecret: GOOGLE.CLIENT_SECRET,
      callbackURL: GOOGLE.CALLBACK_URL,
      scope: ['email', 'profile']
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    cb: VerifyCallback
  ): Promise<any> {
    const { id, name, emails, photos, provider } = profile;

    const user = {
      provider,
      id,
      email: emails[0].value,
      username: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value
    };

    cb(null, user);
  }
}
