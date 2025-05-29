const express = require('express');
const ejs = require('ejs');
const path = require('path')
const connectDB = require('./config/db');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(cookieParser());
const port = process.env.APP_PORT || 3000;

connectDB();

app.use(express.static("public"));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')))
app.use('/axios', express.static(path.join(__dirname, 'node_modules/axios/dist/')))
app.use('/image', express.static(path.join(__dirname, 'public/image')));



//Define Routers
app.use('/', require('./routes/view-route'));
app.use('/user', require("./routes/user-route"));
app.use('/food', require("./routes/food-route"));
app.use((req, res, next) => {
  res.status(404).render('index.ejs');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})