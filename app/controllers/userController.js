
require('dotenv').config();
const User=require('../models/userModel');
const UserOTPVerification=require('../models/userOTPVerificationModel')
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Product=require('../models/productModel');
const Category=require('../models/categoryModel')
const CartItem=require('../models/cartModel');
const {AUTH_EMAIL,AUTH_PASS,HOST_SMTP,HOST_PORT}=process.env

//Nodemailerr stuff
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
        expiresAt:Date.now() + 3600000
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
  // const sendEmail=async(mailOptions)=>{
  //     try {
  //         await transporter.sendMail(mailOptions)
  //         return
  //     } catch (error) {
  //         throw error;
  //     }
  // };

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
                sendOTPVerificationEmail(result,res);
                req.session.flashData = {
                  message: {
                    type: "success",
                    body: "Verify Email",
                  },
                  errors: {},
                  formData: req.body,
                };
                req.session.userid = newUser._id.toString();
                return res.render("user/OTP",{message: {
                  type: "success",
                  body: "Verify Email",
                },formData: req.body,layout:"./layouts/loginLayout"});
                //res.redirect('/OTP')
              })
                // req.session.user=userData;
                //   res.redirect('/')
              },
//GET OTP Page
getOTPPage: (req,res)=>{
  res.render("user/OTP",{layout:"./layouts/loginLayout"});
},
// GET login page
loginPage: async (req, res) => {
            try {
            const error = req.flash("error");
            // const success = req.flash("success");
              res.render("user/login", { message: error, layout:"./layouts/loginLayout" });
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
             res.render('user/login',{message:"Please verify your email ",layout:"./layouts/loginLayout"})
           }else{
            req.session.loggedIn=false;
            req.session.user=userData
            if(userData){
              req.session.loggedIn=true;
            }
            
              res.redirect('/')
           } 
          }
           else {
            res.render('user/login',{message:"Email or password is incorrect",layout:"./layouts/loginLayout"})
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
   
        otpVerify:async (req,res)=>{
          const user=req.session.user;
          
          
          try {
            res.render('user/OTP',{username:user.name,layout:"./layouts/otpLayout"});
          } catch (error) {
            console.log(error.message);
          }
          // console.log("Verify:",user);
          // if(user){
          // res.render("user/OTP",{layout:"./layouts/loginLayout"});
          // }else{
          //   res.redirect('/log')
          // }
        },
        cartPage:async (req,res)=>{
          const user=req.session.user
          try {
            const cartItems={
              name:"abc",
              description:"dsdsa",
              quantity:"123",
              proce:"333"

            }
            res.render('user/cart',{user:user.name,cartItems,layout:"./layouts/userLayout"});
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

        }
      

}
