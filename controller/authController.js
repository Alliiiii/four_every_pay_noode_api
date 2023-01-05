const { User } = require("../models/user")
const bcrypt = require('bcryptjs')


// Social Login COntroller
const socialLogin=async(req,res)=>{
   try{
      if (!req.body.user_social_token) {
         return res.status(400).send({ status: 0, message: 'User Social Token field is required' });
     }
     else if (!req.body.user_social_type) {
         return res.status(400).send({ status: 0, message: 'User Social Type field is required' });
     }
     else if (!req.body.user_device_type) {
         return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
     }
     else if (!req.body.user_device_token) {
         return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
     }
     else{
      const checkUser=await User.findOne({user_social_token:req.body.user_social_token})

      if(!checkUser){
         const newRecord = new User();
         newRecord.user_social_token = req.body.user_social_token,
         newRecord.user_social_type = req.body.user_social_type,
         newRecord.user_device_type = req.body.user_device_type,
         newRecord.user_device_token = req.body.user_device_token,
         newRecord.user_email = req.body.user_email,
         newRecord.verified=1
         const token=await newRecord.generateAuthToken()
         newRecord.user_authentication=token
         const saveLogin=await newRecord.save()
         return res.status(200).json({
             status: 1,
             message: 'Login Successfully',
             data: saveLogin
         }); 

      
    }
    else{
      const token=await checkUser.generateAuthToken()
      const updatedRecord=await User.findOneAndUpdate(
         {_id:checkUser._id},
         {     user_device_type: req.body.user_device_type,
            user_device_token: req.body.user_device_token,
            verified: 1,
            user_authentication: token},
         {new:true}
      )
      return res
      .status(200)
      .json({
          status: 1,
          message: 'Login Successfully',
          token: token,
          data: updatedRecord
      })
    }
     }
     
      res.json({message:"hello socialLogin"})
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

//Sign up Controller
const signUp=async(req,res)=>{
   try{
    const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
    if (!req.body.user_name) {
      return res.status(400).json({ status: 0, message: "User Name is required" })
  } else if (!req.body.user_email) {
      return res.status(400).json({ status: 0, message: "Email is required" })
  } else if (!req.body.user_email.match(emailValidation)) {
      return res.status(400).json({ status: 0, message: "Invalid email address" })
  } 
  else if (!req.body.user_password) {
   return res.status(400).json({ status: 0, message: "Password is required" })
} 
  else if (!req.body.user_password.match(pass)) {
      return res.status(400).json({ status: 0, message: "Invalid Password" })
  } else if (!req.body.user_confirm_password) {
      return res.status(400).json({ status: 0, message: "Confirm Password is required" })
  } else if (req.body.user_password !== req.body.user_confirm_password) {
      return res.status(400).json({ status: 0, message: "Password and Confirm password must be same" })
  }  else if (!req.body.user_device_type) {
      return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
  }
  else if (!req.body.user_device_token) {
      return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
  }
  const user=await User.findOne({ user_email: req.body.user_email})
  if(user){
    return res.status(400).json({message: "Email already exist"})
   }
   else{
const hash_password=await bcrypt.hash(req.body.user_password,10)
const verificationCode = Math.floor(100000 + Math.random() * 900000);
const newUser=new User({
   user_name:req.body.user_name,
   user_email:req.body.user_email,
   user_password:hash_password,
   code:verificationCode,
   user_device_type:req.body.user_device_type,
   user_device_token:req.body.user_device_token
})
//const token=123

const token=await newUser.generateAuthToken()

newUser.user_authentication=token
await newUser.save()
return res.status(200).json({
   status:1,
   message:"Account created",
   data:newUser
})


   }
   }
   catch(error){
    return res.status(500).json({error:error.message})
   }
}

//Login Controller
const login=async (req,res)=>{
   try{
      const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
    if (!req.body.user_email) {
        return res.status(400).json({ status: 0, message: "Email is required" })
    } else if (!req.body.user_email.match(emailValidation)) {
        return res.status(400).json({ status: 0, message: "Invalid email address" })
    } 
    else if (!req.body.user_password) {
      return res.status(400).json({ status: 0, message: "Password is required" })
  } else if (!req.body.user_device_type) {
      return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
  }
  else if (!req.body.user_device_token) {
      return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
  }
  else{
   const user=await User.findOne({user_email:req.body.user_email})
   if(!user){
      return res.status(404).json({ status: 0, message: "User not found" })
   }
   else{
      const isMatch=await bcrypt.compare(req.body.user_password,user.user_password)
     if(!isMatch){
      return res.status(400).json({ status: 0, message: "Password not match" })
     }
     else if(user.verified==0){
      return res.status(400).json(
       {  status: 1,
         message: "Please verify your account.",
         data:user }
      )
     }
     else{
      const token=await user.generateAuthToken()
      const updatedUser=await User.findOneAndUpdate({ user_email: req.body.user_email }, 
         { user_authentication: token ,
              user_device_type: req.body.user_device_type ,
               user_device_token: req.body.user_device_token }, 
               { new: true })
               return res.status(200).json({
                  status: 1, message: "User Login Successful",
                  data:updatedUser
               })


     }
   }


  }
      
      res.json({message:"hello login"})
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

//forgot Password Controller
const forgotPassword=async(req,res)=>{
   try{
      if (!req.body.user_email) {
         return res.status(400).json({ status: 0, message: "Email is required" });
     } else {
      const user=await User.findOne({user_email:req.body.user_email})
      if(!user){
         return res.status(400).json({ status: 0, message: "User not found" })
      }
      else{
         const verficationCode = Math.floor(10000 + Math.random() * 900000)
         const newUser=await User.findByIdAndUpdate({ _id: user._id }, { code: verficationCode }, { new: true })
         if (newUser) {
            return res.status(200).json({ status: 1, 
               message: "Verification Code Send Successfully ",
             user_Id: newUser._id, otpCode:verficationCode,type: "forgetPassword" })
        } else {
            return res.status(400).json({ status: 0, message: "Something went wrong" })
        }
      }
     }
   }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

//Otp Verification Controller
const OTPVerification=async(req,res)=>{
   try{
      if (!req.body.user_id) {
         return res.status(400).json({ status: 0, message: "User ID is required" })
     } else if (!req.body.verificationcode) {
         return res.status(400).json({ status: 0, message: "Verification code is required" })
     }
     await User.findOne({_id:req.body.user_id}).then((result)=>{


      if(req.body.verificationcode==result.code){
         User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 1, code: null }, { new: true }, (err, result) => {
            if (err) {
               console.log(err.message);
               return res.status(400).json({ status: 0, message: "Something went wrong", err });
           }
           if(result){
            return res.status(200).json({
               status: 1, message: "OTP matched successfully",
               data: result})

           }

         })

         console.log("hello")

      }
      else{
         return res.status(400).json({ status: 0, message: "OTP does not matched" })
      }

     })
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

// Resend Code Controller
const resendCode=async(req,res)=>{
   try{
      if (!req.body.user_id) {
         return res.status(400).send({ status: 0, message: 'User id failed is required.' });
     }
     else{
      User.find({_id:req.body.user_id})
      .exec()
      .then(result=>{
         const verficationCode=Math.floor(100000+Math.random()*900000)
         User.findByIdAndUpdate(req.body.user_id,
            {verified:0,code:verficationCode},
            { new: true },
            (err,result)=>{
               if (err) {
                  return res.status(400).send({ status: 0, message: 'Something went wrong.' });
              }
              if (result) {
                  return res.status(200).send({
                      status: 1, message: 'Verification code resend successfully.',
                      code:verficationCode
                  });
              }
            }
            )

      })
     }
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

// Reset Password Controller
const resetPasword=async(req,res)=>{
   try{
      if (!req.body.user_id) {
         res.status(400).send({
             status: 0,
             message: 'User id field is required.'
         });
     }
     else if (!req.body.new_password) {
         res.status(400).send({
             status: 0,
             message: 'New password field is required.'
         });
     }
     else{
     User.find({_id:req.body.user_id})
      .exec()
      .then(user=>{
         bcrypt.hash(req.body.new_password,10,(error,hash)=>{
            if(error){
               return res.status(400).send(
                 { status:0,
                  message:error}
               )
            }
            else{
               User.findByIdAndUpdate(req.body.user_id,
                  { user_password: hash },
                  { new: true },
                  (err, _result) => {
                     if (err) {
                        res.status(400).send({
                            status: 0,
                            message: 'Something went wrong.'
                        });
                    }
                    if (_result) {
                        res.status(200).send({
                            status: 1,
                            message: 'Password updated successfully.'
                        });
                    }
                  }

                  )
            }
         })

      })
     }
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

// Logout Controller
const logOut=async(req,res)=>{
   try{
      const updateUser=await User.findOneAndUpdate(
         {_id:req.user._id},
          {
            user_authentication: null,
            user_device_type: null,
            user_device_token: null
        }, { new: true }
         )
         res.removeHeader("authorization");

         res.status(200).send({ status: 1, message: 'User logout Successfully.' });
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}

// Change Password Controller
const changePassword=async(req,res)=>{
   try{
      if (!req.body.old_password) {
         res.status(400).send({ status: 0, message: 'Old Password field is required' });
     }
     else if (!req.body.new_password) {
         res.status(400).send({ status: 0, message: 'New Password field is required' });
     }
     else if (!req.body.confirm_password) {
         res.status(400).send({ status: 0, message: 'Confirm New Password field is required' });
     }
     else if (req.body.new_password !== req.body.confirm_password) {
      return res.status(400).send({ status: 0, message: 'New password and Confirm New Password should be same' });
  }
     else if (req.body.old_password == req.body.new_password) {
         return res.status(400).send({ status: 0, message: 'Old and New password cant be same' });
     }
     else{
      const userFind=await User.findOne({ _id: req.user._id })
     if(userFind){
      const user_password=await bcrypt.compare(req.body.old_password,userFind.user_password)
      if (!user_password){
         res.status(400).send({ status: 0, message: 'Incorrect Old Password' });
     }
     else if(userFind && user_password==true){
      const newPassword = await bcrypt.hash(req.body.new_password, 8);
      await User.findOneAndUpdate({ _id: req.user._id }, { user_password: newPassword }, { new: true });
      res.status(200).send({ status: 1, message: 'New password Updated Successfully.' });

     }
     else {
      res.status(400).send({ status: 0, message: 'Password Not Match' });
  }
     }
     else {
      res.status(400).send({ status: 0, message: 'Something Went Wrong.' });
  }


     } 
     }
     catch(error){
      return res.status(500).json({error:error.message})
     }
}
/*
 try{
    res.json({message:"hello signup"})
   }
   catch(error){
    return res.status(500).json({error:error.message})
   }
*/
//export 
module.exports={socialLogin,signUp,login,forgotPassword,OTPVerification,resendCode,changePassword,resetPasword,logOut}