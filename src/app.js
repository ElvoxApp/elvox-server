import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoute.js"
import errorHandler from "./middleware/errorHandler.js"
import notFound from "./middleware/notFound.js"

const app = express()

app.use(
    cors({
        origin: ["http://localhost:5173", "https://elvox-app.vercel.app"],
        credentials: true
    })
)

app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("Server is running!")
})

app.use("/auth", authRouter)

app.use(notFound)
app.use(errorHandler)

export default app
