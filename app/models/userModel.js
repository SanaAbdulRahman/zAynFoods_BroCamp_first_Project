const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const addressSchema = new mongoose.Schema({
//   userId:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:'User'
//   },
//    details:{ 
//     city:{
//     type:String,
//     default:"Qusais 5"
//    },
   
//     address:{
//         type:String
//     },
//     pincode:  {
//         type:String
//     }, 
//     landmark:  {
//         type:Number
//     }
// }
   
//});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name can't be smaller than 3 characters"],
      maxlength: [64, "Name can't be greater than 64 characters"],
      required: [true, "Name is Required"],
    },

    email: {
      type: String,
      minlength: [7, "Email is short "],
      maxlength: [128, "Email can't be smaller than 128 characters"],
      required: [true, "Email is Required"],
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: [true, "Password is must"] },
    // cPassword: {
    //   type: String,
    //   minlength: [6, "Atleast 6 digits required"],
    //   required: [true, " You have to confirm password"],
    // },
    mobile: {
      type: Number,
      required: [true,"Mobile number is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    Status: {
      type: String,
      default: "Active",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token:{
      type:String
    },
    // address: [addressSchema],
    addresses: [
      {
        city: String,
        apartment: String,
        building: String,
        flat: String,
        pincode: String,
        landmark: String,
      },
    ],
    make: { type: String },
    model: { type: String },
    role: {
      type: String,
      default: "Customer",
      required: true,
    },
    verifytoken:{
      type: String,

    },
    wallet:{
      type:Number,

    },
    isBlocked:{
      type:Boolean,
      default:false
    },
    wishlist:[mongoose.Schema.Types.ObjectId],
    cart:
        [
          {
            product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'products', required:true, index:true },
            quantity:{type:Number, required:true }
          },
        ]
  },
  { timestamps: true }
);

//Validates unique Email
userSchema.path("email").validate(async (email) => {
  const emailCount = await mongoose.models.User.countDocuments({ email });
  return !emailCount;
}, "Email already exists");

/**
 * Encrypts password if value is changed
 */
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

// userSchema.methods.checkPassword = async function (password) {
//   const result = await bcrypt.compare(password, this.password);
//   return result;
// };
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("cPassword")) next();
//   this.cPassword = await bcrypt.hash(this.cPassword, 10);
//   next();
// });


const User = mongoose.model("User", userSchema);

module.exports = User;
