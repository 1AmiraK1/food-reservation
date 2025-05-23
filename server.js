const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const path = require('path')


//Routers
const homeRoute = require("./routes/home-route")
const dashRoute = require("./routes/dash-route")

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.static("public"));
app.use('/style', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

app.get("/", homeRoute)
app.get("/dashboard", dashRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})