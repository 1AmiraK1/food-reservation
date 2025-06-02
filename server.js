const express = require('express');
const ejs = require('ejs');
const path = require('path')
const connectDB = require('./config/db');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'SESSIONSECRETKEY',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax' }
}))
app.use(helmet());

connectDB().catch(err => {
  console.error('DB connection error:', err);
  process.exit(1);
});

app.use(express.static("public"));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')))
app.use('/axios', express.static(path.join(__dirname, 'node_modules/axios/dist/')))
app.use('/image', express.static(path.join(__dirname, 'public/image')));

app.use((req, res, next) => {
  res.locals.amountSuccess = req.session.amountSuccess || null;
  res.locals.success = req.session.success || null;
  res.locals.errors = req.session.errors || null;
  delete req.session.amountSuccess;
  delete req.session.success;
  delete req.session.errors;
  next();
});


//Define Routers
app.use('/', require('./routes/view-route'));
app.use('/user', require("./routes/user-route"));
app.use('/food', require("./routes/food-route"));
app.use('/payment', require("./routes/payment-route"));
app.use((req, res) => {
  res.status(404).render('404.ejs',{
    errMsg:""
  });
});

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})