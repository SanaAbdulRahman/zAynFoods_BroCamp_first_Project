const { string } = require('joi');
const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
                //category and description
    },
    name:{
        type:String,
       
    },
    
    description:{
        type:String,
       
    },
    typeOfDish:{
        type:String
    },
    
    price:{
        type:Number,
        default:0
    },
    offer:{
        type:String,
     
    },
    quantity:{
        type:Number,
       
    },
    stock:{
        type:Number
    },
//    size:[{
//         type:String   //Pizza - small , medium or large
//     }],
    rating:{
        type:Number,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
   
    
    image:{
        type:String,
        default:''
           },
    images:[{
            type:String
           }],
    
      
    // offer:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Offers'
    // },
    isDeleted: { 
        type: Boolean, 
        default: false }, // Added field for soft delete
    isFeatured:{
        type:Boolean,
        default:false
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
productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
productSchema.set('toJSON',{
    virtuals:true,
});

const Product=mongoose.model('Product',productSchema);
module.exports=Product;