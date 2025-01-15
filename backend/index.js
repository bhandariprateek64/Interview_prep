import express from 'express';
import dotenv from 'dotenv';
import connectdb from './utils/database.js';
import userRouter from './src/routes/user.route.js';
import adminRouter from './src/routes/admin.route.js';
const app = express();
app.use(express.json());
app.use();
const corsOptions = {
  origin: 'http://localhost:5173/',
  credentials: true,
};
app.use(cors(corsOptions));
dotenv.config({});
//routes
app.use('/user', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT;
connectdb()
  .then(() => {
    console.log('DB CONNECTED SUCCESSFULLY');
    app.listen(PORT, () => {
      console.log('SERVER IS LISTENING AT 8000');
    });
  })
  .catch(() => console.log('Error connecting DB', error));
