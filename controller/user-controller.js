const User = require('../models/user-model');
const { createToken } = require('../utils/jwt');

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'ثبت نام موفقیت آمیز بود!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { name: emailOrUsername }
      ]
    });
    if (!user) {
      return res.status(401).json({ message: 'کاربر پیدا نشد!' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'ایمیل/نام کاربری یا رمز اشتباه است' });
    }
    const token = createToken({ id: user._id });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json({ message: 'خطا در سرور', error: err.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.redirect('/');
};

module.exports = {createUser , getAllUsers , loginUser , logoutUser};