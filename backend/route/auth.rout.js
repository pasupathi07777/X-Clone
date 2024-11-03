const express=require("express")
const router=express.Router()
const {authSignup,authLogin,authLogout,authResetPassword,getMe} =require('../controller/auth.controller')
const protectRoute = require("../middleware/protectRoute")

router.post("/signup",authSignup)
router.post("/login",authLogin)
router.post("/logout",authLogout)
router.post("/resetPassword",authResetPassword)
router.get("/me",protectRoute,getMe)



module.exports=router