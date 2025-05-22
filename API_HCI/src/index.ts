import 'reflect-metadata';

require('dotenv').config({ path: __dirname + '/../.env' });

import db from './db';
import express, { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import { Server } from 'http';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import cors from 'cors';
import nodemailer from 'nodemailer';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerValidator from './middleware/swaggerValidator';
import { User } from './entities/user';
import { JwtPayload } from 'jsonwebtoken';
import auth from './middleware/auth';
import { replyWithError } from './http';
import { BadRequestError, NotFoundError } from './types/error';
import { Mailer } from './services/email.service';
import { CronJob } from 'cron';

import apiEndpoints from './utils/endpoints';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import cardRoutes from './routes/card.routes';
import investmentRoutes from './routes/investment.routes';
import paymentRoutes from './routes/payment.routes';

db.initialize()
    .then(() => {
        console.log('Database connection established!');
        //    runInvestmentRound().then(() => console.log('Initial investment round completed!'));
    })
    .catch((err) => { console.error(err) });

//CronJob.from({
//  cronTime: '00 15 * * *',
//  onTick: runInvestmentRound,
//  onComplete: null,
//  start: true,
//});

const app: Express = express();

app.disable("etag");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        // Handle JSON parse error and respond with appropriate error message
        replyWithError(res, new BadRequestError('Invalid JSON.'))
    }
    next(err); // If it's not a parsing error, pass it to the next error handler
});

app.use(cookieParser());
app.use(cors({
    origin: '*', // Permitir cualquier origen
    allowedHeaders: ['Authorization', 'Refresh-Token', 'Content-Type'],
    exposedHeaders: ['Authorization', 'Refresh-Token']
}));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify((error, _) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Mailer service up and running!');
        app.locals.mailer = new Mailer(transporter);
    }
});

const passportOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN
};


passport.use(new passportJwt.Strategy(passportOptions, async function (payload: JwtPayload, done: passportJwt.VerifiedCallback) {
    const user: User = await User.findOne({ where: { id: parseInt(payload.sub!) } });
    if (!user) {
        return done(null, false);
    } else {
        return done(null, user);
    }
}));

const middleware = auth(passport);

app.use(passport.initialize());
app.use(middleware);
app.use(swaggerValidator);

const docsUrl = "/docs";
const specs = swaggerJsDoc(require("../docs/swagger.json"));
app.use(docsUrl, swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use(apiEndpoints.USER, userRoutes);
app.use(apiEndpoints.ACCOUNT, accountRoutes);
app.use(apiEndpoints.CARD, cardRoutes);
app.use(apiEndpoints.INVESTMENT, investmentRoutes);
app.use(apiEndpoints.PAYMENT, paymentRoutes);

app.use((_, res) => { replyWithError(res, new NotFoundError("Route not found.")) });

const httpServer: Server = http.createServer(app);
const PORT: any = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`Docs served on: http://localhost:${PORT}${docsUrl}`);
});