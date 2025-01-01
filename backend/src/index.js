import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js";
import path from "path"


dotenv.config()
const port = process.env.PORT
const __dirname = path.resolve();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/messages', messageRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }


server.listen(port,()=>{
    console.log(`server connected on port ${port}`);
    connectDB()
})


