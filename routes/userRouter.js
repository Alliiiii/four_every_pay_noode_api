const router=require('express').Router()
const {verifyToken}=require('../middleware/authenticate')
const {socialLogin,signUp,login,forgotPassword,OTPVerification,resendCode,changePassword,resetPasword,logOut}=require('../controller/authController')
const {updateProfile,getProfile}=require('../controller/profileController')
const {upload}=require('../config/multer')
const {getContent,blockNotification}=require('../controller/commonController')
const {createPost,getAllPost}=require('../controller/postController')
//Registraion modules routes
router.post('/socialLogin',socialLogin)
router.post('/signUp',signUp)
router.post('/login',login)
router.post("/forgetPassword", forgotPassword)
router.post("/OTPVerification", OTPVerification)
router.post("/resendCode", resendCode)
router.post("/resetPasword", resetPasword)
router.post("/changePassword",verifyToken, changePassword)
router.post("/logOut", verifyToken,logOut)

//ProfileModuleRoute
router.post("/updateProfile",verifyToken, upload.single("image"),updateProfile)
router.get("/getProfile",verifyToken,getProfile)

// Content Routes
router.get('/get-content/:type', getContent);


//Notification on off api
router.post('/blockNotification',verifyToken,blockNotification)

//Post Routes
router.post('/createPost',verifyToken,upload.single("postImage"),createPost)
router.get('/getAllPost',getAllPost)
//export 
module.exports=router