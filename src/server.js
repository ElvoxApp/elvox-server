import app from "./app.js"
import { testConnection } from "./db/db.js"
import env from "./config/env.js"

testConnection()

app.listen(env.PORT, () => {
    console.log(`Server is running on PORT ${env.PORT}`)
})
