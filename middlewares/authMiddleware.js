//const session=require('express-session');

module.exports={
    verifyLogin:(req,res,next)=>{
        if(req.session.loggedIn){
            next();
        }else{
            res.redirect('/login');
        }
    }
    // isLogin:  (req,res,next)=>{
    //     try {
            
    //         if(req.session.user){
    //           }
    //           else{
    //             res.redirect('/login')
    //           }
    //         next();
    //     } catch (error) {
    //         console.log(error.message);
    //     }
       
        
    // },
    // isLogout:(req,res,next)=>{
    //     try {
    //         if(req.session.user){
    //             res.redirect('/home');
    //         }
            
    //         next();
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }
    
}