const jwt=require('jsonwebtoken')
const {User}=require('../models/user')
const verifyToken=async(req,res,next)=>{
    let token


if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
        // Get token from header
        token=req.headers.authorization.split(' ')[1]
    
        
         //verify token
       const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decoded._id

        //Get user from token
         req.user=await User.findById(decoded._id).select('-password')
         next()
    }
    catch(error){
       // console.log(error)
        return res.status(401).send({ status: 0, message: '  Unauthorized' })
       
    }
}
if(!token){
        return res.status(401).send({
        status:0,
        message:"Unauthorized ,no token "
    })

 }


}

module.exports={verifyToken}