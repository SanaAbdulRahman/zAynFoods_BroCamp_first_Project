const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    
    name:{
        type:String,
       
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
                //category and description
    },
    size:{
        type:String   //Pizza - small , medium or large
    },
    // size:[{
    //     type:String   //Pizza - small , medium or large
    // }],
    price:{
        type:Number,
        default:0
    },
    offer:{
        type:String,
     
    },
    description:{
        type:String,
       
    },
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