import pool from "../db/db.js"
import * as logService from "../services/logService.js"
import CustomError from "../utils/CustomError.js"
import { addClient, emitLog, removeClient } from "../utils/sseManager.js"

export const getLogs = async (req, res, next) => {
    try {
        const data = await logService.getLogs(req.params.id)

        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}

export const streamLogs = async (req, res, next) => {
    const electionId = req.params.id

    try {
        const electionRes = await pool.query(
            "SELECT status FROM elections WHERE id = $1 LIMIT 1",
            [electionId]
        )

        if (electionRes.rowCount === 0)
            throw new CustomError("No election found with the given id", 404)

        if (electionRes.rows[0].status === "closed")
            throw new CustomError(
                "Live logs are only available for active elections",
                409
            )
    } catch (err) {
        return next(err)
    }

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    addClient(electionId, res)

    req.on("close", () => {
        removeClient(electionId, res)
    })
}
