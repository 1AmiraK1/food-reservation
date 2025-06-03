const User = require('../models/user-model');
const { createToken } = require('../utils/jwt');

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const user = new User({ firstname, lastname, email, password });
    await user.save();
    req.session.success = true;  
    res.redirect('/login')
  } catch (err) {
    req.session.errors = [{path:'server', msg: err.message}]
    return res.redirect("/login")
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('کاربر پیدا نشد.');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('ایمیل یا رمز اشتباه است');
    }
    const token = createToken({ id: user._id });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });
    res.redirect('/dashboard');
  } catch (err) {
      req.session.errors = [{path:'server', msg: err.message}]
      return res.redirect("/login")
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
      req.session.errors = errors
      return res.redirect("/profile")
    }

    await user.save();
    req.session.success = true;
    res.redirect('/profile');

  } catch (err) {
    console.error(err);
    req.session.errors = [{ msg: err.message }];
    return res.redirect("/profile");
  }
};




module.exports = { createUser, loginUser, logoutUser, editUser};