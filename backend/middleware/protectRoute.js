const jwt=require('jsonwebtoken');
const userModel = require('../model/auth.model');
const protectRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(400).json({ success: false, error: "unauthorized: no token provided"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({ success: false, error: "unauthorized: invalid token provided"})
        }
        const user=await userModel.findOne({_id:decoded.userId}).select("-password")
        if(!user){
            return res.status(400).json({ success: false, error: "user not found"})
        }
        req.user=user
        next()

    }catch(error){
        res.status(500).json({ success: true, error: "internal server error" })
    }


}

module.exports=protectRoute