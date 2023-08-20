const User=require('../models/userModel');

const bcrypt=require('bcrypt');


module.exports={

    loginPage: async(req,res,next)=>{
        const user = req.session.user;
        console.log("Login"+user);
  if (!user) {
    return res.render("user/login",{layout:'./layouts/loginLayout'});
  } else {
    return res.redirect("/login");
  }
},


    // loginPage: async(req,res,next)=>{
    //     res.render('user/login',{layout:'./layouts/loginLayout'});
    // },
    postLogin:async (req,res,next)=>{
    const { email, password } = req.body;
  
    const userData = await User.findOne({ email });
  
    if (!userData) {
      req.flash("error", "No User found!");
      return res.redirect("/login");
    }
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      req.flash("error", "Your Password is wrong!");
  
      return res.redirect("/login");
    }
    req.session.user = userData;
console.log("loginSession" + req.session.user);
  res.redirect("/home");
}
}
