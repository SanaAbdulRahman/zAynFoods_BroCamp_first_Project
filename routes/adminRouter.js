require("dotenv").config();
const express = require("express");
const router = express.Router();
const adminLogin = require("../app/controllers/adminLogin");


router.get('/adminlogin',adminLogin.adminloginPage)



module.exports = router;