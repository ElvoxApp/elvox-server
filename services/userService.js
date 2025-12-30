import bcrypt from "bcrypt"
import pool from "../db/db.js"
import CustomError from "../utils/CustomError.js"

export const checkUserExists = async (data) => {
    const { role, id } = data

    if (!role) throw new CustomError("Role is required", 400)
    if (!id)
        throw new CustomError(
            "Admission number or employee code is required",
            400
        )

    let res

    if (role.toLowerCase() === "student") {
        res = await pool.query(
            "SELECT 1 FROM student_user_view WHERE admno = $1 LIMIT 1",
            [id]
        )
    } else if (role.toLowerCase() === "teacher") {
        res = await pool.query(
            "SELECT 1 FROM teacher_user_view WHERE empcode = $1 LIMIT 1",
            [id]
        )
    } else {
        throw new CustomError("Invalid role", 400)
    }

    if (res.rowCount === 0) return { exists: false }

    return { exists: true }
}

export const updatePassword = async (data) => {
    const { currentPassword, newPassword, confirmNewPassword, id } = data

    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-]).{8,}$/

    if (!currentPassword)
        throw new CustomError("Current password is required", 400)

    if (!newPassword || !confirmNewPassword)
        throw new CustomError(
            "New password and confirm new password is required",
            400
        )

    if (!id) throw new CustomError("User id is required", 400)

    if (!passwordRegex.test(newPassword))
        throw new CustomError(
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
            400
        )

    if (newPassword !== confirmNewPassword)
        throw new CustomError("Passwords do not match", 400)

    const passwordHashRes = await pool.query(
        `SELECT password_hash FROM users WHERE id=$1`,
        [id]
    )

    if (passwordHashRes.rowCount === 0)
        throw new CustomError("Invalid credentials", 401)

    const { password_hash } = passwordHashRes.rows[0]

    const isMatch = await bcrypt.compare(currentPassword, password_hash)

    if (!isMatch) throw new CustomError("Invalid credentials", 401)

    const passwordHash = await bcrypt.hash(newPassword, 10)

    const res = await pool.query(
        "UPDATE users SET password_hash = $1 WHERE id = $2",
        [passwordHash, id]
    )

    if (res.rowCount === 0) throw new CustomError("User not found", 404)

    return { message: "Password updated successfully" }
}

export const getUser = async (userId) => {
    if (!userId) throw new CustomError("User id is required")

    const userRes = await pool.query("SELECT role FROM users WHERE id = $1", [
        userId
    ])

    if (userRes.rowCount === 0) throw new CustomError("User not found", 404)

    const view =
        userRes.rows[0].role.toLowerCase() === "student"
            ? "student_user_view"
            : "teacher_user_view"

    const result = await pool.query(
        `SELECT * FROM ${view} WHERE user_id = $1`,
        [userId]
    )

    const { user_id: id, ...user } = result.rows[0]

    return { id, ...user }
}
