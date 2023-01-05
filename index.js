const express= require('express')
const cors=require('cors')
const env=require('dotenv').config()
var bodyParser = require('body-parser')
const connectDB = require('./config/db')
const Content=require('./models/contentModel')
const port=process.env.PORT||5000

const app=express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//for uploading image
app.use('/upload',express.static('upload'))

//routes
const apiRoutes=require('./routes/userRouter')

app.use('/api',apiRoutes)

//connect mongo db
connectDB()

//Added data in content
const contentSeeder = [
    {
      title: "Privacy Policy",
      content:
        "privacy_policy conent",
      type: "privacy_policy",
    },
    {
      title: "About Us",
      content:
        "about_us conent",
      type: "about_us",
    },
    {
      title: "Terms and Conditions",
      content:
        "terms_and_conditions conent",
      type: "terms_and_conditions",
    },
  ];
  const dbSeed = async () => {
    await Content.deleteMany({});
    await Content.insertMany(contentSeeder);
}
dbSeed().then( () => {
    // mongoose.connection.close();
})
  

app.listen(port,()=>{
    console.log(`server runing on ${port}`)
})


