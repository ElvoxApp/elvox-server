import { Router } from "express"
import requireRole from "../middleware/requireRole.js"
import { createCandidate } from "../controllers/candidateController.js"
import upload from "../middleware/upload.js"

const router = Router()

router.post(
    "/",
    requireRole(["student"]),
    upload.fields([
        { name: "signature", maxCount: 1 },
        { name: "nominee1Proof", maxCount: 1 },
        { name: "nominee2Proof", maxCount: 1 }
    ]),
    createCandidate
)

export default router
