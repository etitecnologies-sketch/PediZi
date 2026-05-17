import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', 'google-not-configured'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', 'google-not-configured'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL', 'http://localhost:3333/api/v1/auth/google/callback'),
      scope: ['email', 'profile'],
    })
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string
      displayName: string
      emails: Array<{ value: string }>
      photos: Array<{ value: string }>
    },
    done: VerifyCallback,
  ) {
    done(null, {
      googleId: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    })
  }
}
