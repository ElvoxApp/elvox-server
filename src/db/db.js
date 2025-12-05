import knex from "knex"
import env from "../config/env.js"

const config = {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_DB,
    ssl: {
        rejectUnauthorized: env.DB_REJECT_UNAUTHORIZED,
        ca: env.DB_CA
    }
}

const db = knex({
    client: "pg",
    connection: config
})

export const testConnection = async () => {
    try {
        const res = await db.raw("SELECT 1+1 AS result")
        console.log("Connected to DB!")
    } catch (err) {
        console.log("Connection failed: ", err.message)
    }
}

export default db
