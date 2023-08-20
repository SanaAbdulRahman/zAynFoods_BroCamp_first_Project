const mongoose=require('mongoose');
const localDB=`mongodb://127.0.0.1:27017/zAYnFoodsDB`;

const connectDB= async()=>{
    await mongoose.connect(localDB,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    console.log("Mongodb database is connected");
}
module.exports=connectDB;