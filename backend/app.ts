import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import usersRoutes from './routes/userRoutes';
import cors from 'cors';
import { configurePassport } from './config/passport';
import session from 'express-session';


const app = express();
const port = process.env.PORT || 4001;


//Middlewares
app.use(bodyParser.json());
//Lack security: app.use(cors());
app.use(cors({
    origin: 'http://localhost:4000' // Replace with your frontend's URL
}));

// Session management middleware
app.use(session({
    secret: 'teamname', // Secret key for signing the session ID cookie
    resave: false, // Prevents session save if it hasn't been modified
    saveUninitialized: false, // Prevents saving uninitialized sessions
    cookie: { maxAge: 3600000 } // 1 hour in milliseconds
}));

// Initialize Passport and configure it
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Use the user routes
app.use('/api/users', usersRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});