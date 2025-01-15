import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: encryptedPassword,
      currentRating: null,
      completedQuestionNames: [],
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(400).json({ message: 'Error registering user' });
    }

    res.status(201).json({
      message: 'Successfully Registered, Please login now.',
      email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ _id: user._id }, 'ssjjsjjznz');

    res.cookie('token', token);
    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



export default userRouter;
