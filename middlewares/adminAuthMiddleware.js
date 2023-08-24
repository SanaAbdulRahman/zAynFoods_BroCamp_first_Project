const isAdminLogIn = async (req,res,next)=>{
    try {
        
        if(req.session.admin._id)
        {
           
        }
        else
        {
            res.redirect('/admin/adminlogin')
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isAdminLogOut = async (req,res,next)=>{
    try {
        
        if(req.session.admin._id)
        {
            res.redirect('/admin/dashboard')
        }
        
            next();
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
                    isAdminLogIn,isAdminLogOut
                 }


                 