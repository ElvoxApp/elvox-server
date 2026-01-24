import { Router } from "express"
import { getLogs } from "../../controllers/logController.js"

const router = new Router()

router.get("/:id/logs", getLogs)

export default router
