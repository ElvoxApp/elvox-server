import { Router } from "express"
import { getLogs, streamLogs } from "../../controllers/logController.js"

const router = new Router()

router.get("/:id/logs/stream", streamLogs)
router.get("/:id/logs", getLogs)

export default router
