import { Router } from "express"
import {
    getOtp,
    verifyOtp,
    signup,
    login,
    logout,
    verifyMe
} from "../controllers/authController.js"
import auth from "../middleware/auth.js"
import requireRole from "../middleware/requireRole.js"

const router = Router()

router.post("/otp", getOtp)
router.post("/otp/verify", verifyOtp)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", auth, verifyMe)

export default router
