const express=require("express")
const cors=require("cors")
const connectDb=require('./db/db.connect')
const cookieParser=require('cookie-parser')
const route = require("./route/auth.rout")
const userRoute = require("./route/user.route")
require('dotenv').config()

// app 
const app=express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// route
app.use("/api/auth",route)
app.use("/api/users",userRoute)




app.listen(process.env.PORT,()=>{
    console.log(`${process.env.PORT} is started`)
    connectDb()
})







