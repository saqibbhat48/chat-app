import express from "express"
import {isLoggedIn} from "../middlewares/auth.middleware.js"
import { getMessages, getUsersForSideBar, sendMessages } from "../controllers/message.controller.js"

const router = express.Router()

router.get('/users', isLoggedIn, getUsersForSideBar)
router.get('/:id', isLoggedIn, getMessages )
router.post('/send/:id', isLoggedIn, sendMessages )

export default router