//require('dotenv/config');
require('dotenv').config();
const User=require('../models/userModel');
const EmailVerification=require('../models/emailverificationModel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');

//require('dotenv').config();

//require('../../config');

//require('dotenv/config');

// const secureString = async (uniqueString) => {
//   const stringHash = await bcrypt.hash(uniqueString, 10);
//   return stringHash;
// };


// const { v4: uuidv4 } = require("uuid");
// const transporter = nodemailer.createTransport({
//   host: "outlook",
//   auth: {
//     user: process.env.AUTH_EMAIL,
//     pass: process.env.AUTH_PASS,
//   },
// });
  
// const { v4: uuidv4 } = require("uuid");


// const transporter = nodemailer.createTransport({
//   host: "smtp.office365.com",
//   Port: 587,
//  //secure: false, // Set to true if using port 465 with secure SMTP
//   auth: {
//     user: "zaynfoods23@hotmail.com",
//     pass: "Bismillah786",
//   },
//   tls:{
//     rejectUnauthorized:false
//   }
// });

// Rest of your code for sending emails



// transporter.verify((err, success) => {
//   if (err) console.log(err);
//   else {
//     console.log("ready for messages");
//     console.log(success);
//   }
// });

  // const sendVerificationEmail = async ({ _id, email }, res) => {
  //      console.log(_id,email)
  //       try {
  //         const url = "http://localhost:5000/";
  //         const uniqueString = uuidv4();
  //         //mailoptions
  //         const mailOptions = {
  //           from: "zaynfoods23@hotmail.com",
  //           to: email,
  //           subject: "zaynfoods : verify email",
  //           html: `<p>Please verify your email to complete the registration process of zaynfoods.
  //                  Click <a href="${
  //                    url + "verify?userId=" + _id + "&uniqueString=" + uniqueString
  //                  }">here</a> to verify.
  //                  <p>This link will <b>expire in 2 hrs</b>.</p>`,
  //         };
  //         console.log("mmmmm")
  //         const hashedString = await secureString(uniqueString);
  //         const newEmailVerification = await new EmailVerification({
  //           userId: _id,
  //           uniqueString: hashedString,
  //           createdAt: Date.now(),
  //           expiresAt: Date.now() + 1000 * 60 * 60 * 2,
  //         });
  //         await newEmailVerification.save();
         
  //         await transporter.sendMail(mailOptions);
          
  //        res.redirect('/login');
  //       } catch (error) {
  //         console.log("email not sent");
  //         console.log(error);
  //       }
  //     };

module.exports={
     registerForm:async (req,res)=>{
      try {
        res.render('user/register',{layout:"./layouts/loginLayout"})
      } catch (error) {
        console.log(error.message);
      }
      
    },
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

      //res.redirect('/OTP');


      const user=new User({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password
      })
      const userData=await user.save()
     // req.session.userId=userData._id;
    
      req.session.user=userData;
        res.redirect('/home')


    //   await sendVerificationEmail(userData, res);

    //   req.flash(
    //     'success',
    //     'Verification email has been sent. Please check your email at https://mail.google.com/mail'
    //    );
     },
     /* The above code is a JavaScript function that verifies an OTP (One-Time Password) for email
     verification. */
      // verify:async (req,res)=>{
     
      //   let { userId, uniqueString } = req.query;
      //   console.log(userId);
      //   console.log(uniqueString);
      //   EmailVerification.find({ userId })
      
      //     .then((result) => {
      //       if (result.length > 0) {
      //         //checking that link expires
      //         const { expiresAt } = result[0];
      //         const hashedString = result[0].uniqueString;
      //         if (expiresAt < Date.now()) {
      //           console.log("expired");
      //           EmailVerification.findOneAndDelete({ userId })
      //             .then((result) => {
      //               User.findByIdAndDelete({ _id: userId })
      //                 .then(() => {
      //                   console.log("signup again due to expired link");
      //                   req.flash(
      //                     "error",
      //                     `Your verification link has expired.Signup again`
      //                   );
      
      //                   res.redirect('/register');
      //                 })
      //                 .catch((error) => {
      //                   console.log("err in user deletion");
      //                 });
      //             })
      //             .catch((error) => {
      //               console.log(error);
      //               console.log("err in email deletion");
      //             });
      //         } else {
      //           bcrypt
      //           //link not expaires case
      //             .compare(uniqueString, hashedString)
      //             .then((result) => {
      //               if (result) {
      //                 User.updateOne({ _id: userId }, { $set: { verified: true } })
      //                   .then(() => {
      //                     EmailVerification.deleteMany({ userId })
      //                       .then(() => {
      //                         req.flash(
      //                           "success",
      //                           "Your email has been verified.Go and Login now !"
      //                         );
      
      //                         res.redirect('/login');
      //                       })
      //                       .catch((error) => {
      //                         console.log(error);
      //                       });
      //                   })
      //                   .catch((error) => {
      //                     console.log(error);
      //                   });
      //               } else {
      //                 req.flash(
      //                   "error",
      //                   `Verification link is not valid.Signup again.`
      //                 );
      
      //                 res.redirect('/register');
      //               }
      //             })
      //             .catch((error) => {
      //               console.log(error);
      //             });
      //         }
      //       } else {
      //         req.flash("error", `No registered User found`);
      
      //         res.redirect('/register');
      //       }
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       console.log("error in find");
      //     });
   // });



      // return userData;
      
    
    // } catch (error) {
    //   console.log("Error signing up:", error);
    //   res.render("user/register", { message: "Error signing up",layout:"./layouts/loginLayout" });
    // }
  //},

  loginPage: async (req, res) => {
  try {
    const error = req.flash("error");
     // const success = req.flash("success");
      res.render("user/login", { message: error, layout:"./layouts/loginLayout" });
  } catch (err) {
    console.log(err);
  }
    
    // try {
    //   res.render("user/login", { error: error, success: success,layout:"./layouts/loginLayout" });
    //  // res.render('user/login',{layout:"./layouts/loginLayout"})
      
    // } catch (error) {
    //   console.log(error.message);
    // }
    
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
            req.session.user=userData
              res.redirect('/home')
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
            res.redirect("/login");
          });
        },
        loadHome:async(req,res)=>{
          const user=req.session.user;
          console.log("hi",user);
          try {    
          // const products=await Product.find()   
          
            res.render('user/home',{username:user.name,layout:"./layouts/userLayout"})
             // res.render('user/home',{layout:"./layouts/userLayout"});
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
            res.render('user/cart',{username:user.name,layout:"./layouts/userLayout"});
          } catch (error) {
            console.log(error.message);
          }
         
        }
      

}
