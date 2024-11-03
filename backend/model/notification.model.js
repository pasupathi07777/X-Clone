const mongoose = require("mongoose")


const notificationSchem = mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["follow", "like"]
        },
        read: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
)

const notificationModel = mongoose.model('notification', notificationSchem)

module.exports = notificationModel