const generateOTP = async()=>{
    try {
        retirn (otp= `${Math.floor(1000+Math.random()* 9000)}`)
    } catch (error) {
        throw error;
    }
};
module.exports=generateOTP;