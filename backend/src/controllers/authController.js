import User from '../models/User.js';
import Society from '../models/Society.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user (student or society admin)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', interests = [], societyName } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 1) Create user first (without society)
    const user = await User.create({
      name,
      email,
      password,
      role,
      interests
    });

    // 2) If society admin, create society with this user as owner and link back
    if (role === 'society_admin') {
      if (!societyName) {
        return res.status(400).json({ message: 'Society name is required for society admins' });
      }
      const society = await Society.create({
        name: societyName,
        owner: user._id
      });
      user.society = society._id;
      await user.save();
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        society: user.society
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        society: user.society
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

