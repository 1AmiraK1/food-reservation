const express = require('express')
const router = express.Router()
const dashController = require("../controller/dash-controller")

router.get("/dashboard", dashController.getDashboard)


module.exports=router