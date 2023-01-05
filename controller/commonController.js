const Content=require('../models/contentModel')
const { User } = require('../models/user')
const getContent=async(req,res)=>{
 try{
    if(!req.params.type){
        return res.send(400).json({
            status:0,
            message:"Content Type is required"
        })
    }
    else{
        Content.findOne({type:req.params.type})
        .exec()
        .then(content=>{
            if(content){
               return  res.status(200).json({
                status: 1, 
                message: 'Content found.',
                data:content 
               })
            }
            else{
                return res.status(404).json({
                    status: 0, 
                    message: 'Content not found.' 
                });
            }
        })

    }
   }
   catch(error){
    return res.status(500).json({error:error.message})
   }
   
}
// Notification on and off controller
const blockNotification=async(req,res)=>{
    try{
       if(!req.body.notification_status){
        res.status(400).send({ status: 0, message: 'Notification status is required' });
       }

       else{
     
            const findUser=await User.findByIdAndUpdate({_id:req.user._id},
                {is_notification:req.body.notification_status,},{new:true})
                return res.status(200).send({
                    status : 1,
                    message:req.body.notification_status==1?
                     "notification on successfully":"notification off successfully",
                    data:findUser
                })
     
     
    }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

module.exports={getContent,blockNotification}