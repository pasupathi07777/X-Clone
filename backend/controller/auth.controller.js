const userModel = require("../model/auth.model")
const bcrypt = require('bcrypt')
const generateToken = require("../utils/generateToken")
const authSignup = async (req, res) => {
    try { 
        const { username, email, password, fullname } = req.body
        const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const existingUsername = await userModel.findOne({ username })
        const existingEmail = await userModel.findOne({ email })
        if (!validateEmail.test(email)) {
            return res.status(400).json({ success: false, error: "invalid email" })
        }
        if (existingEmail || existingUsername) {
            return res.status(400).json({ success: false, error: "already existing username or email" })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, error: "password must have atleast 6 char length" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel(
            {
                username,
                email,
                fullname,
                password: hashPassword
            })
        if (newUser) {
            generateToken(newUser._id,res)
            await newUser.save()
            
            res.status(201).json({ success: true, message: "user created successfully",newUser })
        } else {
            res.status(400).json({ success: false, error: "invalid user data" })
        }

    } catch (error) {
        res.status(500).json({ success: false, error: "internal server error" })
    }
}


const authLogin = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = await userModel.findOne({username})
        const isPasswordCorrect=await bcrypt.compare(password,user.password || "")
        if(!isPasswordCorrect || !user){
            res.status(400).json({ success: true, error: "invalid username or password" })
        }
        generateToken(user._id,res)
        res.status(201).json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: true, error: "internal server error" })
    }
}
const authLogout =  async(req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({success:true,message:"logout successfully"})
    } catch (error) {
        res.status(500).json({ success: true, error: "internal server error" })
    }
}
const getMe =async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.user._id}).select("-password")
        if(!user){
            res.status(400).json({ success: false, error: "user notfound" })
        }
        res.status(200).json({success:true,user})

    } catch (error) {
        res.status(500).json({ success: true, error: "internal server error" })
    }
}
const authResetPassword = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({success:true,message:"logout successfully"})
    } catch (error) {
        res.status(500).json({ success: true, error: "internal server error" })
    }
}

module.exports = { authSignup, authLogin, authLogout, authResetPassword,getMe }