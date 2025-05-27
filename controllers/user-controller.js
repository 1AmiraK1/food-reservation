const User = require('../models/user-model');
const { createToken } = require('../utils/jwt');

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const user = new User({ firstname, lastname, email, password });
    await user.save();
    res.redirect('/login')
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).render('login.ejs', {
        errors: [{ msg: 'کاربر پیدا نشد.' }],
        old: req.body
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render('login.ejs', {
        errors: [{ msg: 'ایمیل یا رمز اشتباه است' }],
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
      errors: [{ msg: 'خطایی در سرور رخ داده است.', error: err.message }],
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

const editUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      currentPass,
      newPass,
      confirmNewPass
    } = req.body;
    const user = await User.findById(req.user._id);
    const errors = [];

    if (firstname && firstname !== user.firstname) user.firstname = firstname;
    if (lastname && lastname !== user.lastname) user.lastname = lastname;
    if (email && email !== user.email) user.email = email;

    const isTryingToChangePassword = currentPass || newPass || confirmNewPass;

    if (isTryingToChangePassword) {
      if (!currentPass || !newPass || !confirmNewPass) {
        errors.push({ path: 'newPass', msg: 'برای تغییر رمز عبور، هر سه فیلد الزامی هستند.' });
      } else {
        const isMatch = await user.comparePassword(currentPass);
        if (!isMatch) {
          errors.push({ path: 'currentPass', msg: 'رمز عبور فعلی نادرست است.' });
        } else if (newPass !== confirmNewPass) {
          errors.push({ path: 'confirmNewPass', msg: 'رمز جدید با تکرار آن مطابقت ندارد.' });
        } else {
          user.password = newPass;
        }
      }
    }

    if (req.file) {
      user.avatar = `/image/uploads/profile/${req.file.filename}`;
    }

    if (errors.length > 0) {
      return res.render('profile.ejs', {
        user,
        errors,
        old: req.body,
        success: false
      });
    }

    await user.save();
    res.redirect('/profile?success=true');

  } catch (err) {
    console.error(err);
    return res.status(500).render('profile.ejs', {
      user: req.user,
      errors: [{ msg: 'خطایی در به‌روزرسانی اطلاعات رخ داده است.' }],
      old: req.body,
      success: false
    });
  }
};


const addBalance = async(req, res) => {
  try {
    const {amount} = req.body;
    const user = await User.findById(req.user._id);
    user.balance += parseInt(amount);
    await user.save();
    res.redirect('/food-reservation?amount=true');
  } catch (error) {
    return res.status(500).render('food.ejs', {
      amount:false,
      errors: [{ msg: 'خطایی در به‌روزرسانی اطلاعات رخ داده است.' }],
      old: req.body,
      user : req.user
    });
  }
};

module.exports = { createUser, loginUser, logoutUser, editUser, addBalance };