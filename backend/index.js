import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectdb from './src/utils/database.js';
import userRouter from './src/routes/user.route.js';
import adminRouter from './src/routes/admin.route.js';
import cookieParser from 'cookie-parser';
dotenv.config({});

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/user', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 8000;

connectdb()
  .then(() => {
    console.log('DB CONNECTED SUCCESSFULLY');
    app.listen(PORT, () => {
      console.log(`SERVER IS LISTENING AT ${PORT}`);
    });
  })
  .catch((error) => console.log('Error connecting DB:', error));
