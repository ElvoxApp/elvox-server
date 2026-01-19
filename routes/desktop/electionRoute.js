import { Router } from "express"
import { getElection } from "../../controllers/electionController.js"

const router = Router()

router.get("/", getElection)

export default router
