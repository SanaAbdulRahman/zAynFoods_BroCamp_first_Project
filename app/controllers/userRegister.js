
const {registerSchema}=require('./validation/formvalidation');
//const { addUser } = require("./userController");
const {joiErrorFormatter,mongooseErrorFormatter} = require("../../config/validationFormatter");
const User=require('../models/userModel');
const bcrypt=require('bcrypt');


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
    // req.session.name = name;
    // req.session.email = email;
    // req.session.mobile = mobile;
    // req.session.password = password;
   
   
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
      const user=new User({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password
      })

      const userData=await user.save()
        req.session.user=userData;
        res.redirect('/home')
      // res.render('user/OTP',{message: "Registration success.",layout:"./layouts/loginLayout"});

      // if(userData){
      //   console.log("Registered successfully");
       
      // }
      // Generate OTP
    //   const otp = generateOTP();
    //   const otpExpiration = new Date(Date.now() + 1 * 600000); // OTP expires in 5 minutes

    //   // Store OTP in session (temporary storage)
    //   req.session.tempOTP = { otp, otpExpiration };
    //   console.log(req.session.tempOTP);

    //   // Create a Nodemailer transporter using your Gmail credentials
    //   const transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //       user: "eshoptoday.001.in@gmail.com",
    //       pass: "yvrejvvhrozuzqid",
    //     },
    //   });

    //   const mailOptions = {
    //     from: "eshoptoday.001.in@gmail.com",
    //     to: email,
    //     subject: "OTP Verification",
    //     text: `Your OTP is: ${otp}`,
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.log("Error sending email:", error);
    //     } else {
    //       console.log("Email sent:", info.response);
    //     }
    //   });

    //   // Redirect to OTP verification
    //   res.redirect("/otp-verification");
    } catch (error) {
      console.log("Error signing up:", error);
      res.render("user/register", { message: "Error signing up",layout:"./layouts/loginLayout" });
    }
  },
  loginPage: async (req, res) => {
    try {
      res.render('user/login',{layout:"./layouts/loginLayout"})
      
    } catch (error) {
      console.log(error.message);
    }
    // const user = req.session.user;
    // if (!user) {
    //   return res.render("user/login",{layout:"./layouts/loginLayout"});
    // } else {
    //   return res.redirect("/OTP");
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
              res.render('user/login',{message:"Please verify your email or mobile",layout:"./layouts/loginLayout"})
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
            res.render('user/home',{username:user.name,layout:"./layouts/userLayout"});
          } catch (error) {
            console.log(error.message);
          }
        },
        otpVerify:async (req,res)=>{
          const user=req.session.user;
          try {
            res.render('user/OTP',{username:user.name,layout:"./layouts/loginLayout"});
          } catch (error) {
            console.log(error.message);
          }
          // console.log("Verify:",user);
          // if(user){
          // res.render("user/OTP",{layout:"./layouts/loginLayout"});
          // }else{
          //   res.redirect('/log')
          // }
        }

}
