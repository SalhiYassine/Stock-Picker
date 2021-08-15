import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running..');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server Running on port ${PORT}`.yellow.bold));
