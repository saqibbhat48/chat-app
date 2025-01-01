import user from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res)=>{
    const {fullName, email, password} = req.body

    try {
        if(!fullName || !email || !password){
            return res.status(400).send("All fields are required")
        }
        if(password.length < 6){
            return res.status(400).send("password should atleast be 6 characters")
        }

        const users = await user.findOne({email})
        if(users) return res.status(400).send("email already exists")
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await user.create({
            fullName,
            email,
            password : hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).send(newUser)
        }
        else{
            res.status(400).send("invalid user data")
        }

    } 
    catch (error) {
        console.log(error.message);
        res.status(501).send("internal server error")
    }
}

export const login = async (req, res)=>{
    const {email, password} = req.body

    try {
        const findUser = await user.findOne({email})
        if(!findUser) return res.status(501).send("Invalid credentials")

        const isPasswordCorrect = await bcrypt.compare(password, findUser.password)
        if(!isPasswordCorrect) return res.status(501).send("Invalid credentials")
        
        generateToken(findUser._id, res)
        res.status(200).send(findUser)
    } 
    catch (error) {
        console.log(error.message);
        res.status(501).send("internal server error")
    }
}

export const logout = (req, res)=>{
    try {
        res.cookie("jwt", "",{maxAge:0})
        res.status(200).send("logout successfully")
    } 
    catch (error) {
        console.log(error.message);
        res.status(501).send("internal server error")
    }
}

export const updateProfile = async (req, res)=>{
     try {
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic) return res.status(400).send("profile pic is required")
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await user.findByIdAndUpdate(userId, {profiePic : uploadResponse.secure_url}, {new : true})

        res.status(200).send(updateUser)
     } catch (error) {
        console.log(`error in update profile ${error.message}`);
        
        res.status(500).send("internal server error")
     }
}

export const checkAuth = (req, res)=>{
    try {
        res.status(200).send(req.user)
    } catch (error) {
        console.log(`error in authCheck ${error.message}`);
        
        res.status(500).send("internal server error")
    }
}