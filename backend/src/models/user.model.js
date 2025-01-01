import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    },
    profiePic : {
        type : String,
        default : ""
    }
},
{timestamps : true}
)

const user = mongoose.model("User", userSchema)

export default user;
