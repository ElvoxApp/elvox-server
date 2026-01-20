import { Router } from "express"
import {
    getNotifications,
    registerDevice,
    markNotificationRead
} from "../../controllers/notificationController.js"

const router = new Router()

router.get("/", getNotifications)
router.post("/devices/register", registerDevice)
router.patch("/:id/read", markNotificationRead)

export default router
