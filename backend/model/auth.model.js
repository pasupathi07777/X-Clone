const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username required"],
        unique: true,
    },
    fullname: {
        type: String,
        required: [true, "fullname required"],
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password required"],

    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }, link: {
        type: String,
        default: ""
    }
}, { timestamps: true })
const userModel = mongoose.model("user", userSchema)
module.exports = userModel