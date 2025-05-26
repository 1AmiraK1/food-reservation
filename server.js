const express = require('express');
const ejs = require('ejs');
const path = require('path')
const connectDB = require('./config/db');
require("dotenv").config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.APP_PORT || 3000;

connectDB();

app.use(express.static("public"));
app.use('/style', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/image', express.static(path.join(__dirname, 'public/image')));



//Define Routers
app.use('/', require('./routes/view-route'));
app.use('/user', require("./routes/user-route"));
app.use((req, res, next) => {
  res.status(404).render('index.ejs');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})