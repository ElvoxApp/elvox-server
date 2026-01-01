import { Router } from "express"
import { getResults } from "../controllers/resultController.js"

const router = new Router()

router.get("/:electionId", getResults)

export default router
