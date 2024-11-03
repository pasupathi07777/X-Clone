const mongoose=require("mongoose")
require('dotenv').config()

const connectDb=async()=>{ 
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")

    }catch(error){
        console.log("DB not connected")
    }
}

module.exports=connectDb