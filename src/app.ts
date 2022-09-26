import express from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './routes';
import dotenv from 'dotenv'

dotenv.config();
import './config/mongoose';
import './config/passport';
import MongoStore from 'connect-mongo';

const app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/test', ttl: 60*10 }),
        secret: process.env.SECRET || 'secret',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    }), 
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use('/',router)

export default app;

