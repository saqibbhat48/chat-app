import jwt from "jsonwebtoken"
import user from "../models/user.model.js"

export const isLoggedIn = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt
        if(!token) return res.status(500).send('you must be logged in')
    
        const data = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET)
        if(!data) return res.status(500).send('user not found')
        const userData =  await user.findById(data.userId).select("-password")
        req.user = userData
        next()
    } catch (error) {
        console.log(`error in isLoggedIn ${error.message}`);
        
        res.status(500).send("internal server error")
    }

}