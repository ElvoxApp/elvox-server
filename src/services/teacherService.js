import pool from "../db/db.js"
import CustomError from "../utils/CustomError.js"

export const getTeacher = async (empcode) => {
    if (!empcode) throw new CustomError("Employee code is required", 400)

    const res = await pool.query("SELECT * FROM teachers WHERE empcode=$1", [
        empcode
    ])

    if (res.rowCount === 0) throw new CustomError("Teacher not found", 404)

    return res.rows[0]
}

export const checkTeacherExists = async (data) => {
    const { empcode } = data
    if (!empcode) throw new CustomError("Employee code is required", 400)

    const res = await pool.query(
        "SELECT 1 FROM teachers WHERE empcode = $1 LIMIT 1",
        [empcode]
    )

    if (res.rowCount === 0) return { exists: false }

    return { exists: true }
}
