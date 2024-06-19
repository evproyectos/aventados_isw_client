const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Register a new user
const register = async (req, res, next) => {
  const { name, lastName, email, password, idNumber, birthDate, phoneNumber, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, lastName, email, password: hashedPassword, idNumber, birthDate, phoneNumber, role});
    await user.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1 hour'
    });
    res.json({ token });
    console.log(token);
  } catch (error) {
    next(error);
  }
};


module.exports = { register, login };