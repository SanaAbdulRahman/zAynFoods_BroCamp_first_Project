
const User=require('../models/userModel')
//const UserOTPVerification = require("../models/UserOTPVerification");
//const bcrypt = require("bcrypt");
//const sendEmail = require("../helpers/eMailer");


const addUser = async (userInput) => {
const user = new User(userInput);
  await user.save().then((result) => {
  try{
    if(result){
        console.log("user added succefully");
  
    }
    
      } catch (error) {
        throw new Error("Error adding user");
      }
    
   // sendOTPVerificationEmail(result);
    // @param(Object) userInput -- It is user input with all variables for  user model
  });
  return user;
};
module.exports = { addUser };
