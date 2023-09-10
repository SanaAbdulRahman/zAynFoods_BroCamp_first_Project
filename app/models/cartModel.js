const { string } = require('joi');
const mongoose=require('mongoose');
const cartSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    },
    count:{
        type:Number
    },
    cartItems:{
        type:String
    },

    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
  
})

const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;