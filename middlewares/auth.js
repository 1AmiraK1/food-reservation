const { verifyToken } = require('../utils/jwt');
const { checkUserImage } = require('../utils/check-user-avatar');
const User = require('../models/user-model');

const protect = async(req, res, next) => {
  try {
      const token = req.cookies.token;
  if (!token) {
    throw new Error()
  }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).lean();
        if (!user) {
        throw new Error()
    }
    user.avatar = checkUserImage(user.avatar);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('token');
    req.session.errors = [{path:'server', msg: 'نشست شما منقضی شده یا نامعتبر است. لطفاً دوباره وارد شوید.'}]
    return res.redirect("/login")
  }
};

const addUserToLocals = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
};

const authedUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const decoded = verifyToken(token);
    if (decoded) {
      return res.redirect('/dashboard');
    }
  } catch (err) {
    return next();
  }
};



module.exports = { protect , authedUser , addUserToLocals };
