import { Router } from "express"
import authMiddleware from "../../middleware/desktopAuth.js"

const router = new Router()

router.get("/", authMiddleware, (req, res) => {
    res.sendStatus(204)
})

export default router
