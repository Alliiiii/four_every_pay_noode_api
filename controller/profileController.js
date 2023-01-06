const {User}=require('../models/user')

const updateProfile=async(req,res)=>{
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    try{
        if (!req.body.user_name) {
            return res.status(400).json({ status: 0, message: "User Name is required" })
        } 
        else if (!req.body.user_email) {
            return res.status(400).json({ status: 0, message: "Email is required" })
        } else if (!req.body.user_email.match(emailValidation)) {
            return res.status(400).json({ status: 0, message: "Invalid email address" })
        } 
        else{
       
            const findUser=await User.findByIdAndUpdate({
                _id:req.user._id
            },{
                user_name:req.body.user_name,
                user_email:req.body.user_email,
                image:req.file?req.file.path:req.body.image,
                is_profile_completed:1
            },
            {new:true}
            )
            return res.status(200).send({
                status : 1,
                message: "profile updated successfully",
                data:findUser
            })

        }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

const getProfile=async(req,res)=>{
    try{
        foundUser=await User.findOne({_id:req.user._id})
        res.status(200).json({ status : 1,message:"user found",data:foundUser})
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

const getAllUser=async(req,res)=>{
    try{
        foundUser=await User.find()
        res.status(200).json({ status : 1,message:"user found",data:foundUser})
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}
module.exports={updateProfile,getProfile,getAllUser}