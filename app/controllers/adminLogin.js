
module.exports={
    adminloginPage:async(req,res,next)=>{
res.render('admin/adminLogin',{layout:"./layouts/loginLayout"})
}
}