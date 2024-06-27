import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/userRoutes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4001;


//Middlewares
app.use(cors({
    origin: 'http://localhost:4000' // Replace with your frontend's URL
}));
//Lack security: app.use(cors());
app.use(bodyParser.json());

// Use the user routes
app.use('/api/users', usersRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});