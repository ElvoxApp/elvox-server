import pool from "../db/db.js"

export const getElections = async () => {
    const res = await pool.query(
        "SELECT * FROM elections WHERE status != 'closed' ORDER BY election_start DESC"
    )

    return res.rows
}
