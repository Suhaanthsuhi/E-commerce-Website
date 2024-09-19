import userModel from '../models/userModel.js';

export const getNotificationsController = async (req, res) => {
    try{
        const { email, subsEmail } = req.body;
        const user = await userModel.findOne({ email: email });
        if(!user){
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        user.notifications = subsEmail;
        await user.save();
        return res.status(200).send({
            success: true,
            message: "Subscribed successfully",
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in subscribing for notifications",
            error,
        });
    }
}