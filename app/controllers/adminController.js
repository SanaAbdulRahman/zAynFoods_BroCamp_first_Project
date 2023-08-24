const {Admin}=require("../models/adminModel");
const Category=require("../models/categoryModel")
const User=require("../models/userModel")
const Product=require("../models/productModel");
// const multer=require('multer');
// const path=require('path');

const bcrypt=require('bcrypt');
// const fs=require('fs');
// const util = require('util');
// const unlink = util.promisify(fs.unlink);

// const bodyparser= require('body-parser');


module.exports={

adminlogin: async(req,res)=>{
    try {
        res.render("admin/adminLogin",{layout:"./layouts/loginLayout"})
    } catch (error) {
        console.log(error.message);
    }
},
// createAdmin:async (req,res)=>{
//     try {
//         const name=req.body.name;
//         const passwordHash=await bcrypt.hash(req.body.password,10);

//         const admin=new Admin({
//             name,
//             passwordHash
//         })
// const adminData= await admin.save()
// console.log(adminData);
// if (adminData) {
//     req.session.admin = { name: adminData.name, _id: adminData._id }; // Set only necessary data
//     res.redirect('/admin/dashboard');
// } else {
//     console.log("Cannot create admin");
//     res.status(500).send("Unable to create admin");
// }
// } catch (error) {
// console.log("Error creating admin:", error.message);
// res.status(500).send("Error creating admin");
// }
adminVerify:async(req,res)=>{
    try {
        const name=req.body.name;
        const password=req.body.password;

        const adminData=await Admin.findOne({name:name})
        console.log(adminData);
        if(adminData){
            const passwordMatch=await bcrypt.compare(password,adminData.passwordHash)
            console.log(passwordMatch);
            if(passwordMatch){
                if(adminData.isAdmin===true){
                    req.session.admin = { name: adminData.name, _id: adminData._id };
                    console.log(req.session.admin); // Set only necessary data
                         res.redirect('/admin/productList');
                }else{
                    res.render('admin/adminLogin',{message:"The user is not Admin.!",layout:"./layouts/loginLayout"});
                }
            }else{
                res.render('admin/adminLogin',{message:"Password is incorrect",layout:"./layouts/loginLayout"});
            }
        }
        else{
            res.render('admin/adminLogin',{message:"Email or password is incorrect",layout:"./layouts/loginLayout"});
        }
    } catch (error) {
        console.log(error.message);
    }

},

loadDashboard:async(req,res)=>{
    const admin=req.session.admin;
    try {
        
            res.render("admin/product",{admin:admin.name,layout:"./layouts/dashboard-layout"});
          
    } catch (error) {
        console.log(error.message);
    }
},
adminlogout: async (req, res) => {
    
    req.session.destroy((err) => {
      if (err) {
        console.log("Error logging out:", err);
      }
      res.redirect("/admin/adminlogin");
    });
  },
  getAllProducts:async(req,res)=>{
    const admin=req.session.admin;
    if (!admin) {
        return res.render('admin-login',{layout:'./layouts/admin-layout'}); // Redirect to your login page
    }
    try {
        const products= await Product.find().populate('category');
        res.render('admin/product',{admin:admin.name,products,layout:'./layouts/dashboard-layout'});
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
    

  },
  getAllCategories:async(req,res)=>{


    try {
        const admin=req.session.admin;
        const categories= await Category.find();
        /* console.log('inside load users view',users) */
        res.render('admin/category',{admin:admin.name,categories:categories,layout:'./layouts/dashboard-layout'});

    } catch (error) {
        console.log(error.message);
    }


    // const admin=req.session.admin;
    // if (!admin) {
    //     return res.render('admin-login',{layout:'./layouts/admin-layout'}); // Redirect to your login page
    // }
    // res.render('admin/category',{admin:admin.name,layout:'./layouts/dashboard-layout'});

  },
  getAllUsers:async(req,res)=>{
    const admin=req.session.admin;
    try {
        const usersData=await User.find()
        console.log("hi",usersData);
        res.render('admin/userList',{users:usersData,admin:admin.name,layout:'./layouts/dashboard-layout'});
        
    } catch (error) {
        console.log(error.message);
    }
    //const messages = await req.flash('info');
    //  

  
  },
 addProduct:async (req,res)=>{
    const admin=req.session.admin;
    if (!admin) {
        return res.render('admin-login',{layout:'./layouts/admin-layout'}); // Redirect to your login page
    }
    try {
        const categories=await Category.find();
        res.render('admin/add-product',{categories,admin:admin.name,layout:'./layouts/dashboard-layout'});
    } catch (error) {
        console.log(error);
    }
   
},
addCategory:(req,res)=>{
    const admin=req.session.admin;
    if (!admin) {
        return res.render('admin-login',{layout:'./layouts/admin-layout'}); // Redirect to your login page
    }
    res.render('admin/add-category',{admin:admin.name,layout:'./layouts/dashboard-layout'});
},
// userList:async (req,res)=>{
//     try {
//         const userData=await User.find()
//     } catch (error) {
//         console.log(error.message);
//     }
// },
createCategory:async(req,res)=>{

    try {
        const name=req.body.name;
        const description=req.body.description;
       // const { name, description } = req.body;
console.log(name,description);
        // Check if a category with the same name (case-sensitive) already exists
         const existingCategory = await Category.findOne({ name: { $regex: name, $options: 'i' } });
        //const existingCategory = await Category.findOne({ name: name });


        if (existingCategory) {
            // Category with the same name already exists, handle accordingly (e.g., show an error message)
            const categories= await Category.find();
            res.render('admin/add-category', { message: 'Category with this name already exists.',categories:categories });
        }
        else
        {
            // Create a new category object
            const newCategory = new Category({
            name: name,
            description: description
            });

            // Save the new category to the database
            const savedCategory = await newCategory.save();
            console.log(savedCategory);
            
            res.redirect('/admin/categoryList'); // Redirect to the category management page
        }
    } catch (error) {
        console.log(error.message);
    }
},
editCategory:async (req,res)=>{
    try {
        const admin=req.session.admin;
        const category=await Category.findOne({_id:req.params.id})
        console.log(category);
        res.render('admin/edit-category',{category,admin:admin.name,layout:'./layouts/dashboard-layout'});
    } catch (error) {
        console.log(error);
    }
},
posteditCategory:async (req,res)=>{
    try {
        const categoryId=req.params.id;
        const {name,description}=req.body;

        const updatedCategory=await Category.findByIdAndUpdate(categoryId,{name,description},{new:true});
        console.log(updatedCategory);
        res.redirect('/admin/categoryList')
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
}
},
createProduct:async (req,res)=>{
 const {name,category,description,size,price,offer,rating}=req.body
 const pname=req.body.name;
 console.log(req.body.name);
     console.log(pname,name,category,size,rating);
     
    const image=req.file?req.file.filename:'';
    try {
        const newProduct= new Product({
            name:name,
            category:category,
            description:description,
            size:size,
            price:price,
            offer:offer,
            rating:rating,
            image:image

        })
        const product = await newProduct.save();
        console.log(product);
        res.redirect('/admin/productList'); 
 } catch (error) {
    console.error(error);
 }   
},
updateProductLoad :async (req,res)=>{
    try {
        const admin=req.session.admin;
        const product=await Product.findOne({_id:req.params.id})
        const category=await Category.findOne({_id:req.params.id})
        console.log(product);
        res.render("admin/edit-product",{product,category,admin:admin.name,layout:'./layouts/dashboard-layout'});
    } catch (error) {
        console.log(error);
    }
},
postEditProduct:async (req,res)=>{
    try {
        const productId=req.params.id;
        const {name,category,description,size,price,offer,rating}=req.body;

        const updatedProduct=await Product.findByIdAndUpdate(productId,{name,category,description,size,price,offer,rating},{new:true});
        console.log(updatedProduct);
        res.redirect('/admin/productList')
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
}
},
}