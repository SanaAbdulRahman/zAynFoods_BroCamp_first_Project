require("dotenv").config();
const connectDB=require('./config/db');
connectDB();
const express=require('express');
const app=express();
const PORT=process.env.PORT || 5000;
const mongoose=require('mongoose');
const path=require('path');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const flash = require('express-flash');
const morgan=require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const expressLayouts=require('express-ejs-layouts');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the express-flash middleware
app.use(flash());

//session store

const store = new MongoStore({
    uri: process.env.MONGO_CONNECTION,
    //uri: 'mongodb://127.0.0.1:27017/zAYnFoodsDB',
    collection: 'sessions'
  });
  
  //session config
app.use(session({secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: false },
     cookie: { maxAge:1000 * 60 * 60 *24 },  //24 hours
    store: store
}))
//Global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.session.user;
    next(); 
})
// app.use((req,res,next)=>{
//     res.locals.user=req.session.user;
//     next();
// });
const adminRouter=require('./routes/adminRouter');
const userRouter=require('./routes/userRouter');
// app.use(bodyParser.json());



app.use(express.static('public'))
app.use(expressLayouts)
app.use(morgan('tiny'));

app.set('layout','./layouts/userLayout');


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.listen(PORT,()=>{
    console.log(`Server is running on port : localhost:${PORT} `);
})

//Handling Error
// process.on("unhandledRejection",err=>{
//     console.log(`An error occured : ${err.message}`);
//     server.close(()=>process.exit(1))
// })