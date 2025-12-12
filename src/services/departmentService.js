import pool from "../db/db.js"
import CustomError from "../utils/CustomError.js"

export const getDepartments = async () => {
    const res = await pool.query("SELECT * FROM departments")

    if (res.rowCount === 0) throw new CustomError("No departments found", 404)

    const departments = res.rows

    return departments
}
