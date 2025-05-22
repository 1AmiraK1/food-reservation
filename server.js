const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const path = require('path')



const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.static("public"));
app.use('/style', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

app.get("/", (req,res)=>{
    res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})