const User = require('../Models/user'),
    LocalStrategy = require('passport-local').Strategy,
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    Config = require('../../app.config');

module.exports = (passport) => {
    /**
     * Passport serialize user function for store user id in each request
    */
    passport.serializeUser((user, done) => {
        done(null, {
            id: user.id
        });
    });

    /**
     * Passport deserialize user function for retrive user id from each request
    */
    passport.deserializeUser((user, done) => {
        User.findById(user.id).
            exec((err, user) => {
                done(err, user);
            });
    });

    /**
     * Passport local login localstrategy function for login a existing user
    */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim().length || !password.trim().length)
            return done('Please provide email or password', false);
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (!user)
            return done('No user found.', false, 'No user found.');
        if (!user.validPassword(password))
            return done('Oops! Wrong password.', false, 'Oops! Wrong password.');
        done(null, user)
    }));

    /**
     * Passport local signuo localstrategy function for register a new user
    */
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim().length || !password.trim().length)
        return done('Please provide email or password', false);
        email = email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
            return done('This email already registred', false);
        }
        let new_user = new User();
        new_user['email'] = email;
        new_user['name'] = req.body.name || `Untitled_${new Date().getTime()}`;
        new_user['password'] = new_user.generateHash(password);
        new_user['subscribe_users'] = [new_user._id];
        const updatedUser = await new_user.save();
        return done(null, updatedUser);
    }));

    /**
     * Passport jwt strategy function for verify bearer toekn in each request
     * Token will be get in auth header value
    */
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: Config.EXPRESS_SESSION.SECRET
    }, async (jwtPayload, done) => {
        const user = await User.findById(jwtPayload.id)
        if (!user)
        return done('No user found', false);
        return done(null, user);
    }));
}