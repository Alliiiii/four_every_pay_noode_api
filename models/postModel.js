const mongoose=require('mongoose')
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
        trim:true,
    },
    description:{
        type:String,
        require:true,
        trim:true,
    },
    postImage:{
            type:String,
            default:null
        },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    }
    
    

},
{timestamps:true})
const Post=mongoose.model("Post",postSchema)
module.exports=Post