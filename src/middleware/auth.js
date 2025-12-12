import jwt from "jsonwebtoken"
import CustomError from "../utils/CustomError.js"
import pool from "../db/db.js"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) throw new CustomError("Authentication required", 401)

        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new CustomError("Invalid or expired token", 401)
        }

        const result = await pool.query("SELECT * FROM users WHERE id=$1", [
            payload.id
        ])

        if (result.rowCount === 0) throw new CustomError("User not found", 401)

        const { password_hash, created_at, ...user } = result.rows[0]

        req.user = user
        req.auth = payload
        next()
    } catch (err) {
        next(err)
    }
}

export default authMiddleware
