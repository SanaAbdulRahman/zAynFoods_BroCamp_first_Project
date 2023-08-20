const connectDB=require('./config/db');
connectDB();
const express=require('express');
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 5000;
const mongoose=require('mongoose');
const path=require('path');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const expressLayouts=require('express-ejs-layouts');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new MongoStore({
    uri: 'mongodb://127.0.0.1:27017/user-auth',
    collection: 'sessions'
  });
app.use(session({secret:"my-session-secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: store
}))

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