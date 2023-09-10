//require("dotenv").config();
const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/adminController");
const adminauth = require('../middlewares/adminAuthMiddleware');
const multer = require("multer");
const path = require("path");
const { cropImage, randomGen } = require('../app/controllers/adminController'); // Correct the import here


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/assetsimages/dish/temp'));
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload=multer({storage:storage});


router.get('/adminlogin',adminController.adminlogin)
router.post('/adminVerify',adminController.adminVerify)


router.get('/dashboard',adminauth.isAdminLogIn,adminController.loadDashboard);
router.get('/logout',adminauth.isAdminLogIn,adminController.adminlogout)
router.get('/productList',adminauth.isAdminLogIn,adminController.getAllProducts);
router.get('/categoryList',adminauth.isAdminLogIn,adminController.getAllCategories);
router.get('/userList',adminauth.isAdminLogIn,adminController.getAllUsers);
router.post('/block-user/:id',adminController.blockUser);
router.post('/unBlock-user/:id',adminController.unBlockUser);
router.get('/add-product',adminauth.isAdminLogIn,adminController.addProduct);
router.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        
      //  console.log(next);
        
        const dataToReturn = await adminController.uploadimage(req, 'dish', 'product-', true);
        console.log(dataToReturn);

        if (dataToReturn.message === 'File uploaded successfully!') {
            // Save the product to the database here
            const product = await adminController.createProduct(req, dataToReturn.imageName);
            console.log(product);
            if (product) {
                res.redirect('/admin/productList');
            } else {
                res.render('admin/add-product', {
                    message: 'Error saving the product to the database',
                    layout: './layouts/dashboard-layout',
                });
            }
        } else {
            res.render('admin/add-product', {
                message: dataToReturn.message,
                layout: './layouts/dashboard-layout',
            });
        }
    } catch (error) {
        console.error("Route error",error);
        res.status(500).send('Internal Server Error');
    }
});
 router.post('/edit-product/:id',upload.single('image'),adminController.postEditProduct);
 router.get('/edit-product/:id',adminController.updateProductLoad);

 router.post('/delete-product/:id',adminController.deleteProduct);
 router.get('/deleted-products',adminController.getAllDeletedProducts);
router.post('/restore-product/:id',adminController.restoreDeletedProduct);
router.get('/add-category',adminauth.isAdminLogIn,adminController.addCategory);
router.post('/add-category',adminController.createCategory);
router.get('/edit-category/:id',adminController.editCategory)
router.post('/edit-category/:id',adminController.posteditCategory)







module.exports = router;