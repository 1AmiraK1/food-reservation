const getHome = (req,res)=>{
    res.render('index.ejs')
}

const getDashboard = (req,res)=>{
    res.render('dashboard.ejs')
}

const getLogin = (req,res)=>{
 res.render('login.ejs', {
    errors: [],
    old: {}
  });
}

const getRegister = (req,res)=>{
    res.render('register.ejs', {
    errors: [],
    old: {}
  })
}

const getProfile = (req, res)=>{
  const user = req.user;
  const success = req.query.success === 'true';
   res.render('profile.ejs', {
    success,
    errors: [],
    old: {},
    user
  })
}

module.exports = {getHome , getDashboard, getLogin, getRegister, getProfile}