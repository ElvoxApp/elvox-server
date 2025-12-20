import { Router } from "express"
import { getElections } from "../controllers/electionController.js"

const router = Router()

router.get("/", getElections)

export default router
