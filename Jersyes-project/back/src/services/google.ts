import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entities/user.entity";
import { myDataSource } from "../connection/data-source";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userRepository = myDataSource.getRepository(User);

        let user = await userRepository.findOne({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = userRepository.create({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails?.[0].value,
          });

          await userRepository.save(user);
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;

import jwt from "jsonwebtoken";

import { getCart } from "./order.service";

export const googleCallBack = async (user: User) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  const cart = await getCart(user.id);

  const params = new URLSearchParams({
    token,
    id: user.id.toString(),
    userName: user.userName,
    email: user.email,
    isManager: user.isManager ? "true" : "false",
    cart: JSON.stringify(cart),
  });

  return params;
};
