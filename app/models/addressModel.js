const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  details:{
    city:{
    type:String,
    default:"Qusais 5"
    },
   
    apartment:{
        type:String
    },
    building:{
        type:String
    }, 
    flat:{
        type:String
    },
    pincode:{
        type:String
    },
    landmark:  {
        type:String
    }
    }
})
   


const Address = mongoose.model("Address", addressSchema);

module.exports = Address;