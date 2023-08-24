const mongoose=require('mongoose');

const adminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    passwordHash:{
        type:String,
        required:true
    },
 
    isAdmin:{
        type:Boolean,
        default:false,
    }
   
})
adminSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
adminSchema.set('toJSON',{
    virtuals:true,
});
exports.Admin=mongoose.model('Admin',adminSchema);
exports.adminSchema=adminSchema;