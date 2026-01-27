import pg from "pg"
const { Pool } = pg

const pool = new Pool({
    connectionString: process.env.DB_URL,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
})

pool.on("error", (err) => {
    console.error("Unexpected PG pool error:", err)
})

export const checkDb = async () => {
    try {
        await pool.query("SELECT 1")
        return true
    } catch {
        return false
    }
}

export default pool
