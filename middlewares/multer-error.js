module.exports = (req, res, next) => {
  const uploadMiddleware = require('../utils/multer').single('avatar');

  uploadMiddleware(req, res, function (err) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.render('profile.ejs', {
        errors: [{path: 'avatar', msg: 'حجم عکس نباید بیشتر از ۲ مگابایت باشد.' }],
        old: req.body,
        user: req.user,
        success: false
      });
    }

    if (err) {
      return res.render('profile.ejs', {
        errors: [{path: 'avatar', msg: 'خطایی در آپلود فایل رخ داد.' }],
        old: req.body,
        user: req.user,
        success: false
      });
    }

    next();
  });
};
