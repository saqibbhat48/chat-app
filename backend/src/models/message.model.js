import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true,
    },
    text : String,
    image : String,
},
{timestamps : true}
)

const message = mongoose.model("Message", messageSchema)

export default message;
