const { verifyToken } = require('../utils/jwt');

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/");
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
