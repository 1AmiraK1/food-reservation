const User = require('../models/user-model');
const { createToken } = require('../utils/jwt');

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    res.redirect('/login')
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    });
    if (!user) {
      return res.status(401).render('login.ejs', {
        errors: [{ msg: 'کاربر پیدا نشد.' }],
        old: req.body
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render('login.ejs', {
        errors: [{ msg: 'ایمیل/نام کاربری یا رمز اشتباه است' }],
        old: req.body
      });
    }
    const token = createToken({ id: user._id });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });
    res.redirect('/dashboard');
  } catch (err) {
    return res.status(500).render('login', {
      errors: [{ msg: 'خطایی در سرور رخ داده است.' , error: err.message }],
      old: req.body
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.redirect('/');
};

module.exports = {createUser , loginUser , logoutUser};