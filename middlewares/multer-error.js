module.exports = (req, res, next) => {
const uploadMiddleware = require('../utils/multer').single('avatar');

  uploadMiddleware(req, res, function (err) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      err.msg = 'حجم عکس نباید بیشتر از ۲ مگابایت باشد.'
      req.session.errors = [err]
      return res.redirect("/profile")
    }

    if (err) {
      err.msg = 'خطایی در آپلود فایل رخ داد.'
      req.session.errors = [err]
      return res.redirect("/profile")
    }
    next();
  });
};
