const Post=require('../models/postModel')
const {User}=require('../models/user')
const  {pushNotifications} = require('../config/utils')
const AppNotification = require('../models/appNotificationModel')
const moment = require('moment')
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
    const getAllMembers = await User.find({_id: {$ne : req.user._id}})
    console.log(getAllMembers.length)
   
   for (let i = 0; i < getAllMembers.length; i++) {
    const notification = new AppNotification({
        title: "New Post Created",
        body: "created a new post",
        notification_type: "post",
        receiver_id: getAllMembers[i]._id,
        sender_id: req.user._id,
        date:  moment(Date.now()).format("dddd, MMMM Do YYYY, h:mm:ss a")

    })
    await notification.save()
    let notifi= {
        user_device_token:  getAllMembers[i]?.user_device_token,  
        title: "New Post Created",
          body: `${req.user.user_name} Created A New Post`
      }
      await pushNotifications(notifi)
   }




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
      const postList=await Post.find().sort({createdAt: -1}).populate("user_id")
      if(postList.length<0){
        return res.status(404).json({
            status: 1,
            message: "Data not find"
        })
      }
      else{
        return res.status(200).json({
            status: 1,
            message: "Post List",
            data: postList
        })
      }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

//Get All Post Specific User
const getAllSpecificUserPost=async(req,res)=>{
    try{
        console.log(req.user)
        const postList=await Post.find({ user_id:req.user._id}).sort({createdAt: -1}).populate("user_id")
        if(postList.length<0){
          return res.status(404).json({
              status: 1,
              message: "Data not find"
          })
        }
        else{
          return res.status(200).json({
              status: 1,
              message: "Post List",
              data: postList
          })
        }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

//Get Post By Id
const getPostById=async(req,res)=>{
    try{
       
       const post=await Post.findOne({_id:req.params.id,}).populate({
        path:"user_id",
        model:"User",
        select:"user_name user_email image",})
       if(!post){
        return res.status(404).json({
            status: 1,
            message: "Data not find"
        })
      }
      else{
        return res.status(200).json({
            status: 1,
            message: "Post found",
            data: post
        })
      }
 
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

//Delete Post
const deletePost=async(req,res)=>{
    try{
     
        const findPost=await Post.findOne({_id:req.params.id})
        console.log(findPost)
       
        if(!findPost){
            return res.status(404).json({
                status: 1,
                message: "Post not find"
            })
        }
       else{
        const post=await Post.findByIdAndRemove({_id:req.params.id,})
       
         return res.status(200).json({
             status: 1,
             message: "Post Remove Successfully",
         })
       
       }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

//Update Post By Id
const editPost=async(req,res)=>{
    try{
        if(!req.body.post_id){
            res.status(400).send({status: 0,message:"Post Id  is required"})
        }
       else if(!req.body.title){
            res.status(400).send({status: 0,message:"Title is required"})
       }
       else if(!req.body.description){
           res.status(400).send({status: 0,message:"Description is required"})
      }
   
   else if(!req.file){
    res.status(400).send({status: 0,message:"Image is required"})
       } 
      else{
        console.log(req.user)
        const post =await Post.findByIdAndUpdate({user_id:req.user._id,_id:req.body.post_id,},
            {
                title:req.body.title,
                description:req.body.description,
                postImage:req.file?req.file.path:req.body.postImage,
          

            },
            {new:true}).populate('user_id')
            if(post){
                return res.status(200).json({
                    status:1,
                    message:"Post  Upadted successfully",
                    data:post
                 })
            }
            else{
                return res.status(400).json({
                    status:1,
                    message:"Post not found",
                 })

            }
      }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

module.exports={createPost,getAllPost,getAllSpecificUserPost,getPostById,editPost,deletePost}