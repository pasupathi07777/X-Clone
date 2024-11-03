const userModel = require("../model/auth.model")
const notificationModel = require("../model/notification.model")



const getProfile = async (req, res) => {
    try {
        const { username } = req.params
        const user = await userModel.findOne({ username })
        if (!user) {
            res.status(400).json({ success: false, error: "user not found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(500).json({ success: false, error: "interna server error" })

    }
}

const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const modifyUser = await userModel.findOne({ _id: id })
        const currentUser = await userModel.findOne({ _id: req.user._id })
        if (modifyUser._id.equals(currentUser._id)) {
            return res.status(400).json({ success: false, error: "You can't follow yourself" });
        }
        if (!currentUser || !modifyUser) {
            return res.status(400).json({ success: false, error: "user not found" })
        }
        const isFollowing = await currentUser.following.includes(id)
        if (isFollowing) {
            // unfollow
            await userModel.findByIdAndUpdate(id, { $pull: { following: req.user._id } })
            await userModel.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            return res.status(200).json({ success: true, message: "unfollow successfully", currentUser })

        } else {
            // follow
            await userModel.findByIdAndUpdate(id, { $push: { following: req.user._id } })
            await userModel.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            const newNotification = await notificationModel.create({ type: "follow", from: req.user._id, to: modifyUser._id })
            return res.status(200).json({ success: true, message: "follow successfully", currentUser, newNotification })
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "interna server error" })

    }
}

const getSuggesstedUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = await userModel.findById(currentUserId).select("-password");
        if (!currentUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        const allUser = await userModel.aggregate([
            {
                $match: {
                    _id: { $ne: currentUserId }
                }
            },
            {
                $sample: { size: 10 }
            }
        ]);
        const filterUsers = allUser.filter((user) => !currentUser.following.includes(user._id))
        const suggestedUsers = filterUsers.slice(0, 4)
        suggestedUsers.forEach((user) => user.password = null)
        res.status(200).json({ success: true, users: suggestedUsers });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};



module.exports = { getProfile, followUnFollowUser, getSuggesstedUser }