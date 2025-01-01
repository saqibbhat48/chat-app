import user from "../models/user.model.js"
import message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await user.find({_id : {$ne : loggedInUserId}}).select("-password")

        res.status(200).send(filteredUsers)
    } 
    catch (error) {
        console.log(`error in getUsersForSideBar controller : ${error.message}`);
        res.status(400).send("internal server error")
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id : userToChatId} = req.params
        const myId = req.user._id

        const messages = await message.find({
            $or : [
                {senderId : myId, receiverId : userToChatId},
                {senderId : userToChatId, receiverId : myId}
            ]
        });

        res.status(200).send(messages)
    } 
    catch (error) {
        console.log(`error in getMessages controller : ${error.message}`);
        res.status(400).send("internal server error")
    }
}

export const sendMessages = async (req, res) => {
    try {
        const {text, image}  = req.body
        const {id: receiverId} = req.params
        const senderId = req.user._id

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await message.create({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

        res.status(201).send(newMessage)
    } 
    catch (error) {
        console.log(`error in sendMessages controller : ${error.message}`);
        res.status(400).send("internal server error")
    }
}