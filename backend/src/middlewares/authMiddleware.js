import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to authenticate user by token and attach user to the request object
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, 'ssjjsjjznz'); // Use your JWT secret key
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
