const { verifyToken } = require('../utils/jwt');
const User = require('../models/user-model');

const protect = async(req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).lean();
        if (!user) {
      res.clearCookie('token');
      return res.redirect('/');
    }
    req.user = user;
    next();
  } catch (err) {
     res.clearCookie('token');
    return res.status(401).render('login', { error: 'نشست شما منقضی شده یا نامعتبر است. لطفاً دوباره وارد شوید.' });
  }
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



module.exports = { protect , authedUser };
