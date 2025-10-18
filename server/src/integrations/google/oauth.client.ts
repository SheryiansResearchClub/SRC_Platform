import env from '@/config/env';
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userRepo } from '@/repositories/user.repository';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google profile missing email'), null);
          }

          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';
          const displayName = profile.displayName || [firstName, lastName].filter(Boolean).join(' ').trim();
          const avatarUrl = profile.photos?.[0]?.value || undefined;

          const existingUser = await userRepo.findByOAuthId(profile.id, 'google');

          if (existingUser) {
            await userRepo.updateLastLogin(existingUser._id.toString());
            return done(null, existingUser);
          }

          const userByEmail = await userRepo.findByEmail(email);

          if (userByEmail) {
            const updatedUser = await userRepo.update(userByEmail._id.toString(), {
              oauthProvider: 'google',
              oauthId: profile.id,
              isEmailVerified: true,
              avatarUrl,
            });

            if (updatedUser) {
              await userRepo.updateLastLogin(updatedUser._id.toString());
              return done(null, updatedUser);
            }

            return done(new Error('Failed to update existing user with Google OAuth data'), null);
          }

          const createdUser = await userRepo.create({
            name: displayName || email,
            email,
            oauthProvider: 'google',
            oauthId: profile.id,
            avatarUrl,
            role: 'member',
          });

          await userRepo.update(createdUser._id.toString(), {
            isEmailVerified: true,
          });

          await userRepo.updateLastLogin(createdUser._id.toString());

          return done(null, createdUser);
        } catch (err) {
          return done(err as Error, null);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: any, done: any) => {
    try {
      const user = await userRepo.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export {
  passport,
  configurePassport,
};