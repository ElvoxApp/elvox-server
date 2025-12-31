import { Router } from "express"
import {
    getAllElections,
    getElection,
    getElections
} from "../controllers/electionController.js"

const router = Router()

router.get("/", getElections)
router.get("/all", getAllElections)
router.get("/:id", getElection)

export default router
