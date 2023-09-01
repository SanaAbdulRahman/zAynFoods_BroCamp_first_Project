
const express = require("express");
const router = express.Router();
const flasherMiddleware=require('../middlewares/flasherMiddleware');
const auth=require("../middlewares/authMiddleware");
//const userLogin = require("../app/controllers/userLogin");
const userController= require("../app/controllers/userController");
const addProduct=require("../app/controllers/addProduct");

//router.get('/home',addProduct.viewHome);

router.get('/register',auth.isLogout,userController.registerForm);
router.post('/register',userController.insertUser);

router.get('/login',auth.isLogout,userController.loginPage)
router.post('/login',userController.postLogin)
router.get('/cart',auth.isLogin,userController.cartPage);
//router.get('/verify',userRegister.verify);

// router.get('/OTP',userRegister.phoneAauth);
 //router.post('/send-otp',userRegister.requestOtp);

 //router.get('/verifyOtp',userRegister.verifyOtp)
// router.post('/verifyOtp',userRegister.insertOtp);

//router.get('/OTP',userRegister.otpVerify);
router.get('/home',auth.isLogin,userController.loadHome);
router.get('/logout',auth.isLogin,userController.logout);
router.get('/product',userController.getProductList)
module.exports = router;