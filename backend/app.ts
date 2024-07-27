import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import usersRoutes from './routes/userRoutes';
import questionRoutes from './routes/questionRoutes';
import testRoutes from './routes/testRoutes'
import cors from 'cors';
import { configurePassport } from './config/passport';
import session from 'express-session';
import { ConnectSessionKnexStore } from "connect-session-knex";
import db from './models/db';

//Express setup
const app = express();
const port = process.env.PORT || 4001;

//Middlewares
app.use(bodyParser.json());
//Lack security: app.use(cors());
app.use(cors({
    origin: 'http://localhost:4000', // Replace with your frontend's URL
    credentials: true //required for cookie passing
}));

// Session management middleware
app.use(session({
    //Note we're using connect-knex-sessions here, equivalent of session storage on redis
    store: new ConnectSessionKnexStore({
        knex: db,
        tableName: 'sessions', // Table name for storing sessions
        createTable: true, // Automatically crreate table if it doesn't exist
        cleanupInterval: 3600000 // Clear expired sessions every 1 hour
    }),
    name: '310dev', // Change this to your desired cookie name
    secret: 'teamname', // Secret key for signing the session ID cookie
    resave: false, // Prevents session save if it hasn't been modified
    saveUninitialized: false, // Prevents saving uninitialized sessions
    cookie: {
        httpOnly: true,
        maxAge: 3600000 // 1 hour in milliseconds
    }
}));

// Initialize Passport and configure it
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Use the user routes
app.use('/api/users', usersRoutes);

// Authenticated route for questions and submissions
app.use('/api/question', questionRoutes);

//Tests
app.use('/api/test', testRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});