import app from "./app.js"
import { testConnection } from "./db/db.js"

testConnection()

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`)
})
