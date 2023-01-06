const AppNotification=require('../models/appNotificationModel')

const getInAppNotification=async(req,res)=>{
    try{
        //console.log(req.user)
        var notify = []
        const notification=await AppNotification.find({receiver_id: req.params.id }).populate({ path: 'sender_id', select: 'user_name user_email image' }).populate({ path: 'receiver_id', select: 'user_name user_email image' }).sort({createdAt: -1})
        //console.log(notification)
        for (let i = 0; i < notification.length; i++) {

            notify.push({
                _id: notification[i]._id,
                title: notification[i].title,
                body: `${notification[i].sender_id?.user_name ? notification[i].sender_id?.user_name : "Undefined"} ${notification[i].body}`,
                notification_type: notification[i].notification_type,
                sender_id: notification[i].sender_id?._id,
                sender_name: notification[i].sender_id?.user_name ? notification[i].sender_id?.user_name : null ,
                sender_image: notification[i].sender_id?.image ? notification[i].sender_id?.image : null,
                date: notification[i].date,
                createdAt: notification[i].createdAt,
                
            })
            

        }
        if (notification.length > 0) {
            return res.status(200).send({
                status: 1,
                message: "Notification Found Successfully",
                data: notify

            })

        } else {
            return res.status(404).send({
                status: 0,
                message: "Notifications Not Found ",

            })
        }
       }
       catch(error){
        return res.status(500).json({error:error.message})
       }
}

module.exports={getInAppNotification}