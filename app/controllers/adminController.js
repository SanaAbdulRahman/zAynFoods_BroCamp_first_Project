const {Admin}=require("../models/adminModel");
const Category=require("../models/categoryModel")
const User=require("../models/userModel")
const Product=require("../models/productModel");
const path=require("path");
const fs=require("fs").promises;
const sharp= require("sharp");
// const multer=require('multer');
// const path=require('path');

const bcrypt=require('bcrypt');
// const fs=require('fs');
// const util = require('util');
// const unlink = util.promisify(fs.unlink);

// const bodyparser= require('body-parser');

function randomGen(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  async function cropImage (path, topath) {
   return new Promise((resolve,reject)=>{
        sharp(path)
        .resize({
            width: 300,
            height: 300,
        })
        .toFile(topath, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(topath);
            }
        });
    })
}


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
    res.setHeader('Cache-Control', 'no-store');
    try {
        var count;

    Product.countDocuments()
        .then((c) => {
         count = c;
            })
            .catch((err) => {
    // Handle error
        console.error("Error fetching count:", err);
        });
       
        const products= await Product.find({isDeleted:false}).sort({ createdAt: -1 }).populate('category');
        res.render('admin/product',{admin:admin.name,products,count:count,layout:'./layouts/dashboard-layout'});
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
  blockUser:async (req,res)=>{
   
           try {
            const userId = req.params.id;
    
            // Find the user by ID
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).render("pages/404",{layout:"./layouts/loginLayout"});
            }
    
            // Toggle the user's status
            const newStatus = user.Status === 'Active' ? 'Inactive' : 'Active';
    
            // Update the user's status in the database
            await User.updateOne({ _id: userId }, { $set: { Status: newStatus } });
    
            res.sendStatus(200); // Send a success response
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
 
    
  },
  unBlockUser:async (req,res)=>{
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!userId) {
            return res.status(404).render("pages/404",{layout:"./layouts/loginLayout"});
        }

        if(user.Status==="Inactive"){
            await User.findByIdAndUpdate(userId,{Status:"Active"});
        }
        else{
            await User.findByIdAndUpdate(userId,{Status:"Inactive"});

        }
        // Toggle the user's status
        //user.Status = user.Status === 'Active' ? 'Inactive' : 'Active';

        // Save the updated user
        // await user.save();
       


        res.redirect('/admin/userList');
    } catch (error) {
        console.error(error);
        res.status(500).render("pages/500",{layout:"./layouts/loginLayout"});
    } 
  },
 addProduct:async (req,res)=>{
    const admin=req.session.admin;
    if (!admin) {
        return res.render('admin-login',{layout:'./layouts/admin-layout'}); // Redirect to your login page
    }
    try {
        const categories=await Category.find();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

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
    const admin=req.session.admin;
    try {
        const name=req.body.name;
        //const description=req.body.description;
       // const { name, description } = req.body;
//console.log(name,description);
        // Check if a category with the same name (case-sensitive) already exists
         const existingCategory = await Category.findOne({ name: { $regex: name, $options: 'i' } });
        //const existingCategory = await Category.findOne({ name: name });


        if (existingCategory) {
            // Category with the same name already exists, handle accordingly (e.g., show an error message)
            const categories= await Category.find();
            res.render('admin/add-category', { admin:admin.name,message: 'Category with this name already exists.',categories:categories,layout:"./layouts/dashboard-layout" });
        }
        else
        {
            // Create a new category object
            const newCategory = new Category({
            name: name,
            
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
/* The above code is a JavaScript function that handles the creation of a new product. It is an
asynchronous function that takes in a request object (req) and a response object (res) as
parameters. */


createProduct: async (req,imageName) => {
   //console.log("next:",next);
    const {category,name, description, typeOfDish, price, offer, quantity, stock, rating } = req.body;
    
    const image = req.file ? req.file.filename : '';
    console.log(image);

    try {
        // Check if image needs cropping
        if (req.file) {
            const imagePath = path.join(__dirname, '../../public/assetsimages/dish/temp', req.file.filename);
            const croppedImagePath = path.join(__dirname, '../../public/assetsimages/dish', 'cropped-' + req.file.filename);

            // Crop the image to desired dimensions
            await cropImage(imagePath, croppedImagePath);

            // Delete the original image
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting original image:', err);
                }
            });
        }

        // Create a new product object
        const newProduct = new Product({
            category: category,
            name: name,
            description: description,
            typeOfDish: typeOfDish,
            price: price,
            offer: offer,
            quantity: quantity,
            stock: stock,
            rating: rating,
            image: 'cropped-' + req.file.filename, // Use the cropped image filename
        });

        // Save the new product to the database
        const product = await newProduct.save();
        console.log('Product saved successfully:', product);
        return product;

        
        //res.redirect('/admin/productList');
    } catch (error) {
        console.error('Error saving product to the database:', error);
       //next(error)
       throw error
    }
},


updateProductLoad :async (req,res)=>{
    try {
        const admin=req.session.admin;
       // const products= await Product.find().populate('category');
        const product=await Product.findOne({_id:req.params.id}).populate('category');
        if (!product) {
            return res.status(404).render("pages/404",{layout:"./layouts/loginLayout"});
        }
        const categories = await Category.find();
        //const category=await Category.findOne({_id:req.params.id})
       // const category=product.category;
        console.log(product);
        res.render("admin/edit-product",{product,categories,admin:admin.name,layout:'./layouts/dashboard-layout'});
    } catch (error) {
        console.log(error);
        res.status(500).render("pages/500",{layout:"./layouts/loginLayout"});
    }
},
postEditProduct:async (req,res)=>{

    try {
        const productId = req.params.id;
        const { name, category, description,typeOfDish,quantity,stock,price, offer, rating } = req.body;

        // Find the product by ID
        const product = {};

        // if (!product) {
        //     return res.status(404).send('Product not found');
        // }

        // Update the product properties
        product.name = name;
        product.category = category;
        product.description = description;
        product.typeOfDish=typeOfDish
        product.quantity=quantity,
        product.stock=stock
        product.price = price;
        product.offer = offer;
        product.rating = rating;



             // Handle image update
             if (req.file) {
                // Delete the existing image if there is one
                if (product.image) {
                    const imagePath = path.join(__dirname, '../public/assetsimages/', product.image);
                    await fs.unlink(imagePath).catch(error => {
                        console.error('Error deleting image:', error);
                    });
                }
                
                    const imagePath = path.join(__dirname, '../../public/assetsimages/dish/temp', req.file.filename);
                    const croppedImagePath = path.join(__dirname, '../../public/assetsimages/dish', 'cropped-' + req.file.filename);
        
                    // Crop the image to desired dimensions
                    await cropImage(imagePath, croppedImagePath);
        
                    // Delete the original image
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Error deleting original image:', err);
                        }
                    });
                
    
                // Save the new image filename to the product
                product.image = 'cropped-' + req.file.filename ;
            }
        // Save the updated product
        await Product.findByIdAndUpdate(productId,product);

        res.redirect('/admin/productList');
    } catch (error) {
        console.error(error);
        res.status(500).render("pages/500",{layout:"./layouts/loginLayout"});
    }
},
deleteProduct:async (req,res)=>{
    try {
        const productId=req.params.id;
        const deletedProduct=await Product.findByIdAndUpdate(productId,{isDeleted:true});
        if(!deletedProduct){
            return res.status(404).render("pages/404",{layout:"./layouts/loginLayout"})
        }
        res.redirect('/admin/productList');
    } catch (error) {
        console.error(error);
        res.status(500).render("pages/500",{layout:"./layouts/loginLayout"});
    }
},
getAllDeletedProducts:async (req,res)=>{
    const admin=req.session.admin;
    if (!admin) {
        return res.render('admin-login',{layout:'./layouts/admin-layout'}); // Redirect to your login page
    }
    try {
        var count;

        Product.countDocuments()
            .then((c) => {
             count = c;
                })
                .catch((err) => {
        // Handle error
            console.error("Error fetching count:", err);
            });
           
            const products= await Product.find({isDeleted:true}).sort({ createdAt: -1 }).populate('category');
            res.render('admin/deleted-products',{admin:admin.name,products,count:count,layout:'./layouts/dashboard-layout'});
        
    } catch (error) {
        console.error(error);
        res.status(500).render("pages/500",{layout:"./layouts/loginLayout"});
    }
},
restoreDeletedProduct:async (req,res)=>{
    
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(productId, { isDeleted: false });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/admin/productList');
    } catch (error) {
        console.error(error);
        res.status(500).render("pages/500",{layout:"./layouts/loginLayout"});
    }
},


  
// Function to crop and upload an image
 uploadimage:async (req, toDir, prefix, crop) =>{
    return new Promise(async (resolve, reject) => {
      let dataToReturn = { message: 'No data is available!', error: 'No error' };
      const tempPath = req.file.path;
      const newFileName = prefix + randomGen(15) + path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.join(__dirname, "../../public/assetsimages/"+toDir+"/"+newFileName);
     // const targetPath = path.join(__dirname, '../public/uploads/dish' + toDir + '/' + newFileName);
      const ext = path.extname(req.file.originalname).toLowerCase();
  
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        if (crop) {
          try {
            // Crop the image using sharp
            await sharp(tempPath)
              .resize({ width: 260, height: 260 })
              .toFile(targetPath);
          } catch (err) {
            dataToReturn.error = err;
            reject(new Error('Internal server error detected!'));
            console.log(err);
            return;
          }
        } else {
          try {
            fs.renameSync(tempPath, targetPath);
          } catch (err) {
            dataToReturn.error = err;
            reject(new Error('Internal server error detected!'));
            console.log(err);
            return;
          }
        }
  
        dataToReturn.message = 'File uploaded successfully!';
        dataToReturn.imageName = newFileName;
        resolve(dataToReturn);
      } else {
        fs.unlinkSync(tempPath, (err) => {
          if (err) {
            console.log(err);
            reject(new Error('Internal server error detected!'));
          }
        });
        reject(new Error('Invalid file format, only images are supported!'));
      }
    });
  }
  

}