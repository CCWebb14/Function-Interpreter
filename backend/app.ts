import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/userRoutes';

const app = express();
const port = process.env.PORT || 4001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use the user routes
app.use('/api/users', usersRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});