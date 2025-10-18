import axios from 'axios';
import env from '@/config/env';
import { InternalServerError, UnauthorizedError, ValidationError } from '@/utils/errors';

const discordTokenClient = async (code: string): Promise<any> => {
  const formData = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: env.DISCORD_REDIRECT_URI,
    code
  });

  let tokenResponse: any;
  try {
    tokenResponse = await axios.post('https://discord.com/api/oauth2/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  } catch (error: any) {
    if (error?.response?.status === 400) {
      throw new UnauthorizedError('Invalid Discord authorization code');
    }

    throw new InternalServerError('Failed to exchange Discord authorization code');
  }

  if (!tokenResponse.data.access_token) {
    throw new InternalServerError('Discord access token missing in response');
  }

  return tokenResponse.data;
}

const discordUserClient = async (accessToken: string, refreshToken: string, expiresIn: string, scope: string, tokenType: string): Promise<{
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scopes: string[];
}> => {
  let userResponse;
  try {
    userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `${tokenType ?? 'Bearer'} ${accessToken}` }
    });
  } catch (error: any) {
    throw new InternalServerError('Failed to fetch Discord profile');
  }

  const discordUser = userResponse.data;

  if (!discordUser?.email) {
    throw new ValidationError('Discord account email is required');
  }

  const scopes = typeof scope === 'string'
    ? scope.split(' ').filter(Boolean)
    : Array.isArray(scope)
      ? scope
      : [];

  const expiresInSeconds = Number(expiresIn ?? 0) || 0;

  return {
    id: discordUser.id,
    username: discordUser.username ?? discordUser.global_name ?? 'Discord User',
    discriminator: discordUser.discriminator ?? '0',
    avatar: discordUser.avatar ?? undefined,
    email: discordUser.email,
    accessToken,
    refreshToken,
    expiresIn: expiresInSeconds,
    scopes
  };
}

const getDiscordAuthorizationUrl = (): string => {
  return `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${env.DISCORD_REDIRECT_URI}&scope=identify+guilds+email+guilds.join+gdm.join+connections`
}

export {
  discordTokenClient,
  discordUserClient,
  getDiscordAuthorizationUrl
};
