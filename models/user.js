const mongoose=require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    user_name:{
        type:String,
        trim:true,
        default:null,
    },
    user_email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    user_password:{
        type:String,
        trim:true
    },
    is_profile_completed:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        default:null
    },
    code: {
        type: Number,
        default: null
    },
    user_authentication: {
        type: String,
        required: false
    },
    verified: {
        type: Number,
        default: 0
    },
    user_social_token: {
        type: String,
        required: false,
        default: null
    },
    user_social_type: {
        type: String,
        required: false,
        default: null
    },
  user_device_type: {
        type: String,
        required: false,
        default: null
    },
    user_device_token: {
        type: String,
        required: false,
        default: null
    },
    is_notification:{
        type:Number,
        default:0
    },

},
    {timestamps:true})

userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.user_authentication=token;
    await user.save();
        // console.log("tokeeen--->", token);
        return token;

}
const User=mongoose.model("User",userSchema)
module.exports={User}
