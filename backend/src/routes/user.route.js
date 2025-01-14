import express from 'express';
import { bcrypt } from 'bcryptjs';
import User from '../models/user.model'
const userRouter = express.Router();
userRouter.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).send({ message: 'User already registered' });
      return;
    }
    //BCRYPT AAEGI
    const encryptedPassword = await bcrypt.hash(password, 10);
    let newUser = new User({
      fullName,
      email,
      password: encryptedPassword,
      currentRating: null,
      completedQuestionNames: [],
    });
    newUser = await newUser.save();
    if (!newUser) {
      res.status(400).json({
        message: 'Error registering user',
      });
    }
    res.status(201).json({
      message: 'Successfully Registered, Please login now.',
      email: email,
    });
  } catch (error) {
    res.send(error);
  }
});
userRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).send('Email and password are required.');

    const user = await User.findOne({ email: email });

    if (!user) return res.status(401).send('Invalid credentials.');

    const validPassword = await bcrypt.compare(user.password, password);
    if (!validPassword) return res.status(401).send('Invalid credentials.');

    // Create a JWT TOKEN
    const token = jwt.sign({ _id: user._id }, 'ssjjsjjznz');

    // Add the token to cookie and send it back to user
    res.cookie('token', token);
    res.send('Login successful.');
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export default userRouter;
