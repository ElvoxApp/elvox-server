import { Router } from "express"
import {
    checkUserExists,
    getUser,
    updatePassword
} from "../controllers/userController.js"
import auth from "../middleware/auth.js"
import requireRole from "../middleware/requireRole.js"

const router = Router()

router.get("/exists", checkUserExists)
router.patch("/update-password", auth, updatePassword)
router.get("/:userId", auth, requireRole(["admin"]), getUser)

export default router
