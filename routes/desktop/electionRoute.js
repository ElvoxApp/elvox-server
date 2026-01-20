import { Router } from "express"
import {
    getElection,
    activateVotingSystem
} from "../../controllers/electionController.js"

const router = Router()

router.get("/", getElection)
router.post("/:id/secret-key/verify", activateVotingSystem)

export default router
