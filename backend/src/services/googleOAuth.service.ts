import axios from 'axios';
import { prisma } from '../lib/prisma';
import { generateTokenPair } from '../utils/tokens';
import { env } from '../config/env';

export class GoogleOAuthService {
  static async handleCallback(code: string) {
    // Exchange code for Google tokens
    const tokenRes = await axios.post<{ access_token: string }>(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id:     env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  env.GOOGLE_CALLBACK_URL,
        grant_type:    'authorization_code',
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Fetch user profile
    const userRes = await axios.get<{
      id: string;
      email: string;
      name: string;
      picture: string;
    }>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, email, name, picture } = userRes.data;

    // Upsert user — create settings on first login
    const user = await prisma.user.upsert({
      where:  { email },
      create: {
        email,
        name,
        avatar:        picture,
        provider:      'GOOGLE',
        providerId:    id,
        emailVerified: true,
        settings:      { create: {} },
      },
      update: { name, avatar: picture, providerId: id },
    });

    const tokens = generateTokenPair(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data:  { refreshToken: tokens.refreshToken },
    });

    return { user, tokens };
  }
}
