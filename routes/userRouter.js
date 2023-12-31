
const express = require("express");
const router = express.Router();
const flasherMiddleware=require('../middlewares/flasherMiddleware');
const auth=require("../middlewares/authMiddleware");
//const userLogin = require("../app/controllers/userLogin");
const userController= require("../app/controllers/userController");
const checkUserStatusMiddleware = require('../middlewares/checkUserStatusMiddleware');
//const addProduct=require("../app/controllers/addProduct");

//router.get('/home',addProduct.viewHome);

router.get('/register',auth.verifyLogin,userController.registerForm);
router.post('/register',userController.insertUser);

router.get('/login',auth.verifyLogin,userController.loginPage)
router.post('/login',userController.postLogin)

router.get('/forgot-password',userController.getForgotPassword);
router.post('/forgot-password',userController.postForgotPassword);

router.get('/reset-password/:token',userController.getResetPassword);
router.post('/reset-password/:token',userController.postResetPassword);

 
router.get('/cart',userController.cartPage);
router.post('/update-cart',userController.updateCart);


router.get('/OTP',userController.getOTPPage);
 
 router.post('/verifyOtp',userController.verifyOTP);

 router.post('/resendOTPVerificationCode',userController.resendOTPVerificationCode)
 //router.post('/resendOTP',userController.resendOTPVerificationCode)

router.get('/',userController.loadHome);
router.get('/logout',userController.logout);
router.get('/product',userController.getProductList);

router.get('/profile',auth.verifyLogin,userController.profilePage);
router.post('/add-address',userController.addAddress)


router.get('/checkout',auth.verifyLogin,userController.getCheckoutPage);

router.get('/order',auth.verifyLogin,userController.getOrderPage)
router.post('/orders',auth.verifyLogin,userController.orderStore);

//router.post('/changeQuantity/:product',userController.changeProductQuantity)
router.get('/changeQuantity/:product',userController.changeProductQuantity)

router.get('/clearcart',userController.clearCart);

//router.get('/add-to-cart/:id',auth.verifyLogin,userController.getAddToCart);
module.exports = router;