import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/userModel';

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    console.log('User not found');
                    
                    return done(null, false, { message: 'User not found' });
                }
                const isMatch = await user.validPassword(password);
                if (!isMatch) {
                    console.log('Wrong Password');
                    return done(null, false, { message: 'Wrong Password' });
                }
                console.log('Logged in Successfully');
                
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (err) {
                console.log(err);                
                return done(err);
            }
        }
    )
);

passport.use(
    'signup',
    new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const name = req.body.name;
            const user = await User.findOne({ email });
            if (user) {
                console.log('User already exists');
                return done(null, false, { message: 'User already exists' });
            }
            const newUser = await User.create({ name, email, password });
            return done(null, newUser);
        } catch (err) {
            console.log(err);
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    if(user instanceof User) {
        done(null, {_id:user._id});
    }
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if(!user) return done(null, false);
        done(null, {id:user._id, email:user.email, name:user.name});
    } catch (err) {
        done(err);
    }
});