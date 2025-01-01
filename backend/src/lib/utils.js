import jwt from "jsonwebtoken"

export const generateToken = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge : 7 * 20 * 60 * 60 * 1000, //ms
        httpOnly : true,
        sameSite : "strict",
        secure : process.env.NODE_ENV !== "development"
    })

    
}