/**
 * third party libraries
 */
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoConnect } from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
import userRoute from './routes/userRoutes.js';
import productRoute from './routes/productRoutes.js';
import {handleError} from  "./helper/error.js"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
mongoConnect();

/**
 * express application
 */
const app = express();
// configure to only allow requests from certain origins
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

//app.use(express.static('public'));
app.use(express.static(join(__dirname, 'public')));

const server = createServer(app);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);



const errorMiddleware = (err, _req, res, _next) => {
  console.log('err', err.message);
  handleError(err, res);
};
app.use(errorMiddleware);
server.listen(process.env.PORT, () => {
  console.log(`server running in dev mode & listening on port ${process.env.PORT}`);
});

