import dotenv from "dotenv"

dotenv.config()

const env = {
    PORT: process.env.PORT || 3000,
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_HOST: process.env.DB_HOST || "",
    DB_PORT: process.env.DB_PORT,
    DB_DB: process.env.DB_DB || "",
    DB_REJECT_UNAUTHORIZED: process.env.DB_REJECT_UNAUTHORIZED,
    DB_CA: process.env.DB_CA || ""
}

export default env
