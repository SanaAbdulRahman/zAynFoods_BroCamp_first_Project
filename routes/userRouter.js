
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
router.get('/cart',auth.isLogin,userRegister.cartPage);
//router.get('/verify',userRegister.verify);

// router.get('/OTP',userRegister.phoneAauth);
 //router.post('/send-otp',userRegister.requestOtp);

 //router.get('/verifyOtp',userRegister.verifyOtp)
// router.post('/verifyOtp',userRegister.insertOtp);

//router.get('/OTP',userRegister.otpVerify);
router.get('/home',auth.isLogin,userRegister.loadHome);
router.get('/logout',auth.isLogin,userRegister.logout)
module.exports = router;