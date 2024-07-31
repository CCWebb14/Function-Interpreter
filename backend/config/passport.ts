import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByUsername, findUserById, verifyPassword } from '../models/users';

export const configurePassport = () => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await findUserByUsername(username);
                if (!user) {
                    return done(null, false, { message: 'User not found.' });
                }
                const isValid = await verifyPassword(user, password);
                if (!isValid) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user: any, done) => {
        done(null, user.userID);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
