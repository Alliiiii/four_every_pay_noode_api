const Post=require('../models/postModel')

//Create Post Controller
const createPost=async(req,res)=>{
    try{
    if(!req.body.title){
         res.status(400).send({status: 0,message:"Title is required"})
    }
    else if(!req.body.description){
        res.status(400).send({status: 0,message:"Description is required"})
   }

   else if(!(req.file?req.file.path:req.body.postImage)){
 res.status(400).send({status: 0,message:"Image is required"})
    } 
   else{
  

    const newPost=new Post({
        title:req.body.title,
        description:req.body.description,
        postImage:req.file?req.file.path:req.body.postImage,
        user_id:req.user._id
    })
    console.log(newPost)
    await newPost.save()
    return res.status(200).json({
        status:1,
        message:"Post  created successfully",
        data:newPost
     })
   }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

//Get All Post Controller 
const getAllPost=async(req,res)=>{
    try{
        res.json({message:"hello getAllPost"})
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

module.exports={createPost,getAllPost}