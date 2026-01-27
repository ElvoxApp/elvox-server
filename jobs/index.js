import pool, { checkDb } from "../db/db.js"
import { advanceElectionStatus } from "./advanceElectionStatus.js"
import { sendDeadlineNotifications } from "./sendDeadlineNotifications.js"

let running = false

const runCron = async () => {
    if (running) return

    const dbReady = await checkDb()
    if (!dbReady) {
        console.log("DB not ready, skipping cron run")
        return
    }

    running = true

    let client

    try {
        client = await pool.connect()

        await client.query("BEGIN")

        const res = await client.query(
            `SELECT id FROM elections WHERE status != 'closed' LIMIT 1`
        )

        if (res.rowCount === 0) {
            await client.query("COMMIT")
            return
        }

        const electionId = res.rows[0].id

        await advanceElectionStatus(client, electionId)

        await client.query("COMMIT")

        await sendDeadlineNotifications(electionId)
    } catch (err) {
        if (client) {
            await client.query("ROLLBACK")
        }
        console.error("Cron failed:", err.message)
    } finally {
        if (client) client.release()
        running = false
    }
}

// run every 30 seconds
setInterval(runCron, 30000)

setTimeout(runCron, 30000)
