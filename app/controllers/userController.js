
require('dotenv').config();
const User=require('../models/userModel');
const Address=require('../models/addressModel');
const UserOTPVerification=require('../models/userOTPVerificationModel')
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Product=require('../models/productModel');
const Category=require('../models/categoryModel')
const CartItem=require('../models/cartModel');
const crypto=require('crypto');
const randomstring=require('randomstring');
const { MongoNetworkError } = require('mongodb');
const {AUTH_EMAIL,AUTH_PASS,HOST_SMTP,HOST_PORT}=process.env


//Nodemailer stuff
let transporter=nodemailer.createTransport({
  host: HOST_SMTP,
  port: HOST_PORT,
  secure: false,
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    },
    auth:{
        user:AUTH_EMAIL,
        pass:AUTH_PASS,
    },
});

//testing transport success
transporter.verify((error,success)=>{
  if(error){
      console.log("hello",error);
  }else{
      console.log("Ready for messages");
      console.log(success);
  }
  });
const resendOTP=async(req,res)=>{
  if(!req.session.user){
    throw new Error("User does not exist!");
  }
  const user=req.session.user;
  await sendOTPVerificationEmail(user._id,user.email);
}

  const sendOTPVerificationEmail=async({_id,email},res)=>{
    try {
      const otp=`${Math.floor(1000 + Math.random() * 9000)}`;
      console.log("OTP :", otp);
      //mail options
      const mailOptions={
        from : AUTH_EMAIL,
        to : email,
        subject:"Verify your Email",
        html:`<p>Enter <b> ${otp} </b> in the app to verify your email address and complete the sign up</p>`
        // <p>This code <b> expires in 1 hour </b>.</p>
      };
      //hash the otp
      const saltRounds=10;

      const hashedOTP=await bcrypt.hash(otp,saltRounds);
      const newOTPVerification= await new UserOTPVerification({
        userId:_id,
        otp:hashedOTP,
        createdAt:Date.now(),
        expiresAt:Date.now() + 60000
      });
      //save otp record
      await newOTPVerification.save();
      await transporter.sendMail(mailOptions);
     
      // res.json({
      //   status:"PENDING",
      //   message:"Verification otp email sent",
      //   data:{
      //     userId:_id,
      //     email,
      //   },
      // });
    } catch (error) {
      console.log(error);
      // res.json({
      //   status:"FAILED",
      //   message:error.message,
      // })
    }
  }



  const sendResetPasswordEmail=async(name,email,token)=>{
    try {
      // const otp=`${Math.floor(1000 + Math.random() * 9000)}`;
      // console.log("OTP :", otp);
      //mail options
      const mailOptions={
        from : AUTH_EMAIL,
        to : email,
        subject:"Reset password",
        html:'<p>Hi '+name+', Please click here to <a href="http://localhost:5000/reset-password?token='+token+'"> Reset </a> your password.</p>'

        // html:`<p>Enter <b> ${otp} </b> in the app to verify your email address and complete the sign up</p>`
        // <p>This code <b> expires in 1 hour </b>.</p>
      };
      //hash the otp
      // const saltRounds=10;

      // const hashedOTP=await bcrypt.hash(otp,saltRounds);
      // const newOTPVerification= await new UserOTPVerification({
      //   userId:_id,
      //   otp:hashedOTP,
      //   createdAt:Date.now(),
      //   expiresAt:Date.now() + 60000
      // });
      //save otp record
     // await newOTPVerification.save();
      await transporter.sendMail(mailOptions);
     
      // res.json({
      //   status:"PENDING",
      //   message:"Verification otp email sent",
      //   data:{
      //     userId:_id,
      //     email,
      //   },
      // });
    } catch (error) {
      console.log(error);
      res.render('pages/500',{layout:"./layouts/loginLayout"});
      // res.json({
      //   status:"FAILED",
      //   message:error.message,
      // })
    }
  }

  // const sendEmail=async(mailOptions)=>{
  //     try {
  //         await transporter.sendMail(mailOptions)
  //         return
  //     } catch (error) {
  //         throw error;
  //     }
  // };
  function generateUniqueToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
module.exports={
//GET Register form
registerForm:async (req,res)=>{
              try {
                res.render('user/register',{layout:"./layouts/loginLayout"})
              } catch (error) {
                console.log(error.message);
              }
              
            },

//POST register form
insertUser: async (req, res) => {
            const { name, password, email, mobile } = req.body;
            req.session.name = name;
            req.session.email = email; 
            req.session.mobile = mobile;
            req.session.password = password;
   
   
              // Validate inputs (add more validation as needed)
              if (!name  || !email || !mobile || !password) {
                return res.render("user/register", {message: "All fields are required",layout:"./layouts/loginLayout" });
              }

              try {
                // Check if the user already exists
                const existingUser = await User.findOne({
                  $or: [{ name }, { email }],
                });
                if (existingUser) {
                  console.log("Username or email already exists");
                  // User with the same username or email already exists
                  return res.render("user/register", {
                    message: "Username or email already exists",
                    layout:"./layouts/loginLayout"
                  });
                }
                }
                catch(error){
                  console.log(error);
                }
                const newUser=new User({
                  name:req.body.name,
                  email:req.body.email,
                  mobile:req.body.mobile,
                  password:req.body.password
                })
                //const userData=await newUser.save()
              // req.session.userId=userData._id;
             newUser.save().then((result)=>{
                //Handle account verification
                //sendVerificationEmail(result,res);
               // sendOTPVerificationEmail({_id:user._id,email:user.email},res);
                console.log("Result",result);
                sendOTPVerificationEmail({_id:result._id,email:result.email},res);
                // req.session.flashData = {
                //   message: {
                //     type: "success",
                //     body: "Verify Email",
                //   },
                //   errors: {},
                //   formData: req.body,
                // };
               req.session.user=newUser;
               req.session.loggedIn=true;
                // req.session.userid = newUser._id.toString();
               // return 
                res.redirect('/OTP')
              })
                // req.session.user=userData;
                //   res.redirect('/')
              },
//GET OTP Page
getOTPPage: (req,res)=>{
    if (req.session.user) {
      res.render("user/OTP",{message: {
        type: "success",
        body: "Verify Email",
      },formData: req.body,layout:"./layouts/loginLayout"});
      //res.render("user/OTP",{layout:'./layouts/loginLayout'});
    } else {
      res.redirect("/register");
    }
  },


  verifyOTP:async (req,res)=>{
    try {
      const otp=req.body.otp;
      //let {userId,otp}=req.body;
      const user=req.session.user
      console.log("OTP and userId :", otp,user);
      if(!user || !otp){
        throw Error("Empty otp details are not allowed!");
      }else{
        const UserOTPVerificationRecords= await UserOTPVerification.find({userId:user._id})
        console.log("Records :" , UserOTPVerificationRecords);
        if(UserOTPVerificationRecords.length<=0){
          //no record found
          //throw new Error("Account record doesn't exist or has been verified already. Please sign up or login");
          res.render("user/OTP",{message: {
            type: "Error",
            body: "Account record doesn't exist or has been verified already. Please resend OTP",
          },formData:req.session.user,layout:"./layouts/loginLayout"});
        }else{
          //user otp reord exists
          const {expiresAt}=UserOTPVerificationRecords[0];
          console.log(expiresAt);
          const hashedOTP=UserOTPVerificationRecords[0].otp;
  
          if(expiresAt < Date.now()){
            //user otp record has expired
             await UserOTPVerification.deleteMany({userId:user._id})
             //throw new Error("Code has expired. Please request again.")
             res.render("user/OTP",{message: {
              type: "Error",
              body: "OTP Expired",
            },formData:req.session.user,layout:"./layouts/loginLayout"});
  
          }else{
           const validOTP= await bcrypt.compare(otp,hashedOTP);
           if(!validOTP){
             //supplied otp is wrong 
             //throw new Error("Invalid code passed. Check your inbox.")
             res.render("user/OTP",{message: {
                type: "Error",
                body: "Invalid OTP",
              },formData:req.session.user,layout:"./layouts/loginLayout"});
              
           }else{
            //success
            await User.updateOne({ _id: user._id }, { isVerified: true });
            //await User.updateOne({userId:user._Id},{isVerified:true});
            await UserOTPVerification.deleteMany({userId:user._id})
            res.redirect("/login")
            // res.render("user/cart",{message: {
            //   type: "success",
            //   body: "Your Email is verified. Now you can access your cart",
            // },layout:"./layouts/loginLayout"});
            // res.json({
            //   status:"VERIFIED",
            //   message:`User email verified successfully.`,
            // })
  
           }
          }
        }
      }
    } catch (error) {
      res.json({
        status:"FAILED",
        message:error.message,
      })
    }
  
  },
  


  
//POST (submit otp)


//POST resend OTP
resendOTPVerificationCode:async (req,res)=>{
                          try {
                            const user=req.session.user
                            console.log("user :",user);
                            //let email=req.body;
                            if(!user._id || !user.email){
                              throw Error("Empty user details are not allowed");
                            }else{
                              //delete existing records and resend
                              await UserOTPVerification.deleteMany({userId:user._id});
                              sendOTPVerificationEmail({_id:user._id,email:user.email},res);
                              req.session.flashData = {
                                message: {
                                  type: 'success',
                                  body: 'OTP has been resent'
                                }
                              };
                          
                              res.redirect('/OTP');
                            }
                          } catch (error) {
                            res.json({
                              status:"FAILED",
                              message:error.message, 
                            })
                          }
},
// GET login page
loginPage: async (req, res) => {
            try {
            const error = req.flash("error");
           // const success = req.flash('success');
              res.render("user/login", { message: error,successMessage: req.flash('success'), layout:"./layouts/loginLayout" });
          } catch (err) {
            console.log(err);
          }  
          },

//login form post
 postLogin: async (req, res) => {
          try {
          const email=req.body.email;
          const password=req.body.password;
           
          const userData=await User.findOne({email:email});
          if (userData) {
           const passwordMatch=await bcrypt.compare(password,userData.password)
           if (passwordMatch) {
            if(!userData.isVerified){
             req.flash("error");
              // req.flash(
              //   "error",
              //   "Your email is not verified! Go to your inbox and verify."
              // );
          
              //return res.redirect("/login");
             res.render('user/login',{message: error,successMessage: req.flash('success'),layout:"./layouts/loginLayout"})

             //res.render('user/login',{message:"Please verify your email ",layout:"./layouts/loginLayout"})
           }else{
            req.session.loggedIn=false;
            req.session.user=userData
            res.redirect('/')
            if(userData){
              req.session.loggedIn=true;
            }
            
              // res.redirect('/')
           } 
          }
           else
            {
            res.render('user/login',{message: error,successMessage: req.flash('success'),layout:"./layouts/loginLayout"})

            // res.render('user/login',{message:"Email or password is incorrect",layout:"./layouts/loginLayout"})
           }

          } else {
            res.render('user/login',{message:"Email or password is incorrect",layout:"./layouts/loginLayout"})
          }
         } catch (error) {
          console.log(error.message);
         }
        //     const { email, password } = req.body;
          
        //     const userData = await User.findOne({ email });
          
        //     if (!userData) {
        //       req.flash("error", "No User found!");
        //       return res.redirect("/login");
        //     }
        //     const passwordMatch = await bcrypt.compare(password, userData.password);
        //     if (!passwordMatch) {
        //       req.flash("error", "Your Password is wrong!");
          
        //       return res.redirect("/login");
        //     }
        //     req.session.user = userData;
        // console.log("POstLogin",  req.session.user );
        //   res.redirect("/OTP");
        },
getForgotPassword:(req,res)=>{
          res.render('user/forgot-password',{successMessage: req.flash('success'),
          errorMessage: req.flash('error'),layout:"./layouts/loginLayout"});
},

postForgotPassword:async (req,res)=>{
  try {
    const email = req.body.email;

    // Generate a unique reset token and save it in the database
    const token = generateUniqueToken();
    console.log('Generated Token:', token);
    const user = await User.findOneAndUpdate(
      { email:email },
      { $set: { token:token} }, // Set expiration to 1 hour from now
      { new: true }
    );

    if (!user) {
      req.flash('error', 'No user found with this email.');
      return res.redirect('/forgot-password');
    }

    // Send a password reset email
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
    

    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    };

    await transporter.sendMail(mailOptions);

    req.flash('success', 'Password reset instructions have been sent to your email.');
    console.log("Email sent");
    res.redirect('/forgot-password');
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred. Please try again later.');
    console.log(Error);
   // res.redirect('/forgot-password');
  }
},   
getResetPassword:async(req,res)=>{
  try {
    const token=req.params.token;
                                                                   
    //check if the reset token is valid and not expired
    const user=await User.findOne({
      token:token,
      })
    
    if(!user){
      req.flash('error','Invalid or expired reset Token.');
      return res.redirect('/forgot-password');
    }else{
      res.render('user/reset-password',{user_id:user._id,token:user.token,layout:"./layouts/loginLayout"})
    }
   
  } catch (error) {
    console.log(error);
    //req.flash('error', 'An error occured. Please try again')
    //req.redirect('/forgot-password');
    res.render('pages/404',{layout:"./layouts/loginLayout"})
  }
},
postResetPassword:async(req,res)=>{
  try {
    const newPassword=req.body.password;
    const user_id=req.body.user_id;
    
   

  //check if the reset token is valid and not expired

  const user=await User.findOne({_id:user_id})



  if(!user){
    req.flash('error','Invalid or expired reset Token.');
    return res.redirect('/forgot-password');
  }

  //Update the user's password and remove the reset token
  const saltRounds=10;
  const hashedPassword=await bcrypt.hash(newPassword,saltRounds);
  await User.findByIdAndUpdate({_id:user_id},{
    $set:{password:hashedPassword,token:undefined}
  })

  req.flash('success','Password reset succesful. You can now login with your new password.');
  res.redirect('/login');
  } catch (error) {
    console.log(error);
    req.flash('error','An error occured. Please try again');
    res.redirect('/forgot-password')
  }
},
    
logout: async (req, res) => {
          req.session.destroy((err) => {
            if (err) { 
              console.log("Error logging out:", err);
            }
            res.redirect("/");
          });
        },
loadHome:async(req,res)=>{
          const user=req.session.user
          //const user=req.session.loggedIn;
          // if(req.session.loggedIn)
          // console.log(req.session.user);
          // //const user=req.session.user;
          // req.session.loggedIn=true;
         
          try {    
           const categories=await Category.find()   
          Product.countDocuments()
            .then((c) => {
             count = c;
                })
                .catch((err) => {
        // Handle error
            console.error("Error fetching count:", err);
            });
           
            const products= await Product.find({isDeleted:false}).sort({ createdAt: -1 }).populate('category');
            if(user){
            res.render('user/home',{username:user.name,categories,products,layout:"./layouts/userLayout"})
            }else{
                  res.render('user/home',{categories,products,user,layout:"./layouts/userLayout"});
            }
            
              } catch (error) {
            console.log(error.message);
          }
        },
   

cartPage:async (req,res)=>{
          const user=req.session.user
          try {
            // const cartItems={
            //   name:"abc",
            //   description:"dsdsa",
            //   quantity:"123",
            //   proce:"333"

            // }
            // res.render('user/cart',{username:user.name,cartItems,layout:"./layouts/userLayout"});
            if(user){
            res.render('user/cart',{username:user.name,layout:"./layouts/userLayout"});
            }else{
            res.render('user/cart',{layout:"./layouts/userLayout"});

            }
          } catch (error) {
            console.log(error.message);
          }
         
        },
getProductList:async(req,res)=>{
          const user=req.session.user
          try {
            const categories=await Category.find()   
            Product.countDocuments()
            .then((c) => {
             count = c;
                })
                .catch((err) => {
        // Handle error
            console.error("Error fetching count:", err);
            });
           
            const products= await Product.find({isDeleted:false}).sort({ createdAt: -1 }).populate('category');
            res.render("user/product",{username:user.name,categories,products,layout:"./layouts/userLayout"})
          } catch (error) {
            console.error(error);
            res.status(500).render('pages/500');
          }
        },

        // postAddtoCart:async(req,res)=>{
         
        //     try {
        //       const { productId, quantity } = req.body;
        //       console.log("pId , quantity :",productId,quantity);
        //       // Check if the product is already in the cart
        //       let cartItem = await CartItem.findOne({ product: productId });
          
        //       if (cartItem) {
        //         // If it exists, update the quantity
        //         cartItem.quantity += quantity;
        //         await cartItem.save();
        //       } else {
        //         // If it doesn't exist, create a new cart item
        //         cartItem = new CartItem({ product: productId, quantity });
        //         await cartItem.save();
        //       }
          
        //       res.status(200).json({ message: 'Product added to cart' });
        //     } catch (error) {
        //       console.error(error);
        //       res.status(500).json({ error: 'Internal server error' });
        //     }
        // },
getAddToCart:async (req,res)=>{
          const userId=req.session.user._id;
          const productId=req.params.id;

        },
updateCart:(req,res)=>{
  if(!req.body._id){
    throw new Error("Item does not exist!");
  }
    //for the first time creatng the cart and adding basic object structure
    if(!req.session.cart){
      //console.log(req.session.cart);
      req.session.cart={
        items:{},
        totalQty:0,
        totalPrice:0
      }
    }
  //let productObject = {};
  let cart=req.session.cart;

 // let cart=req.session.cart;
  console.log(req.body);
   console.log("cartNew :",cart);
  //console.log("cart",cart.items);
//check if item does not existin cart
if(cart.items["undefined"]){
  delete cart.items["undefined"];
}
if(!cart.items[req.body._id]){
  //console.log("hii");
    cart.items[req.body._id]={
      item:req.body,
      qty:1,
    }
    console.log("cart",cart.items);
    cart.totalQty=cart.totalQty + 1;
    cart.totalPrice= cart.totalPrice + req.body.price
    console.log("cart...",cart);
}else{
  cart.items[req.body._id].qty=cart.items[req.body._id].qty + 1 ;
  cart.totalQty=cart.totalQty+1;
  cart.totalPrice=cart.totalPrice + req.body.price

}
cart.totalPrice=0;
Object.values(cart.items).forEach(item=>{
  console.log("item :",item);
  cart.totalPrice=cart.totalPrice+(item.item.price * item.qty);
})
req.session.cart=cart;
console.log('response',req.session.cart);
//res.update('user/cart',{layout: "./layouts/userLayout"});
return res.json({totalQty:req.session.cart.totalQty});
},

profilePage:(req,res)=>{
  const user=req.session.user
  try {
    // const cartItems={
    //   name:"abc",
    //   description:"dsdsa",
    //   quantity:"123",
    //   proce:"333"

    // }
    // res.render('user/cart',{username:user.name,cartItems,layout:"./layouts/userLayout"});
    if(user){
    res.render('user/profile',{username:user.name,layout:"./layouts/userLayout"});
    }else{
    res.render('user/profile',{layout:"./layouts/userLayout"});

    }
  } catch (error) {
    console.log(error.message);
  }
},

addAddress:async (req,res)=>{
  const user=req.session.user;
  try {
    // Get user data from the form
    const userId = user._id
    console.log("userId :",userId); // Assuming you have the user's ID available in req.user
    const { name, email, mobile, apartment,building,flat, pincode, landmark } = req.body;
    console.log("req.body  :",req.body);

    // Create a new address object
    const newAddress = new Address({
      userId, // User's ID
      details: {
        name:name,
        email:email,
        mobile:mobile,
        apartment:apartment,
        building:building,
        flat:flat,
        pincode:pincode,
        landmark:landmark,
      },
    });

    // Create a new address document in the Address collection
    const addressDoc = await newAddress.save();

    // const addressDoc = await Address.create(newAddress);

    // Find the user by their ID and push the new address document's ID to their address array
    await User.findByIdAndUpdate(userId, { $push: { address: addressDoc._id } });

    // Redirect the user to their profile page or any other desired location
    res.redirect('/'); // Change this URL as needed
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


}
