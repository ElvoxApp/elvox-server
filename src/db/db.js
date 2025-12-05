import knex from "knex"

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DB,
    ssl: {
        rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED,
        ca: process.env.DB_CA
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
