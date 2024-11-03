const express=require("express")
const protectRoute = require("../middleware/protectRoute")
const { getProfile,followUnFollowUser,getSuggesstedUser } = require("../controller/user.controller")
const userRoute=express.Router()


userRoute.get("/profile/:username",protectRoute,getProfile)
userRoute.get("/follow/:id",protectRoute,followUnFollowUser)
userRoute.get("/suggested",protectRoute,getSuggesstedUser)

module.exports=userRoute