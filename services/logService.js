import pool from "../db/db.js"
import CustomError from "../utils/CustomError.js"
import { emitLog } from "../utils/sseManager.js"

export const getLogs = async (id) => {
    if (!id) throw new CustomError("Election id is required", 400)

    const res = await pool.query(
        "SELECT * FROM logs WHERE election_id = $1 ORDER BY created_at ASC",
        [id]
    )

    return res.rows
}

export const createLog = async (electionId, data) => {
    if (!electionId) throw new CustomError("Election id is required", 400)
    if (!data?.level) throw new CustomError("Log level is required", 400)
    if (!data?.message) throw new CustomError("Log message is required", 400)

    const electionRes = await pool.query(
        "SELECT status FROM elections WHERE id = $1 LIMIT 1",
        [electionId]
    )

    if (electionRes.rowCount === 0)
        throw new CustomError("No election found with the given id", 404)

    if (electionRes.rows[0].status === "closed")
        throw new CustomError("Logs cannot be created at this state", 409)

    const logRes = await pool.query(
        "INSERT INTO logs (election_id, level, message) VALUES ($1, $2, $3) RETURNING *",
        [electionId, data?.level, data?.message]
    )

    try {
        emitLog(electionId, logRes.rows[0])
    } catch (err) {
        console.log(err)
    }

    return logRes.rows[0]
}
