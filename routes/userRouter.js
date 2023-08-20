
const express = require("express");
const router = express.Router();
const flasherMiddleware=require('../middlewares/flasherMiddleware');
const auth=require("../middlewares/authMiddleware");
//const userLogin = require("../app/controllers/userLogin");
const userRegister = require("../app/controllers/userRegister");
const addProduct=require("../app/controllers/addProduct");

//router.get('/home',addProduct.viewHome);

router.get('/register',auth.isLogout,userRegister.registerForm);
router.post('/register',userRegister.insertUser);

router.get('/login',auth.isLogout,userRegister.loginPage)
router.post('/login',userRegister.postLogin)

router.get('/OTP',auth.isLogin,userRegister.otpVerify);
router.get('/home',auth.isLogin,userRegister.loadHome);
router.get('/logout',userRegister.logout)
module.exports = router;