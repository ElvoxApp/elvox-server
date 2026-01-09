import { getExpectedStatus, STATUS_ORDER } from "../utils/electionStatus.js"
import { sendNotification } from "../services/notificationService.js"

const STATUS_MESSAGES = {
    nominations: "Nominations are now open",
    "pre-voting": "Nominations have closed",
    voting: "Voting is now open",
    "post-voting": "Voting has closed",
    closed: "The election has ended"
}

const REMINDER_MESSAGES = {
    nomination: {
        student: {
            "24h": "Only 24 hours left to submit or withdraw applications",
            "1h": "Only 1 hour left to submit or withdraw applications"
        },
        tutor: {
            "24h": "Only 24 hours left before nominations close, please review any pending applications",
            "1h": "Only 1 hour left before nominations close, please review any pending applications"
        },
        other: {
            "24h": "Only 24 hours left for nominations to close",
            "1h": "Only 1 hour left for nominations to close"
        }
    },
    votingStart: {
        all: {
            "24h": "Voting starts in 24 hours",
            "1h": "Voting starts in 1 hour"
        }
    }
}

const MS = {
    HOUR: 60 * 60 * 1000
}

const isWithinWindow = (deadline, now, windowMs) => {
    const diff = deadline - now
    return diff <= windowMs && diff > windowMs - 30 * 1000
}

export const advanceElectionStatus = async (client, electionId) => {
    const now = new Date()

    // lock election
    const { rows } = await client.query(
        `
        SELECT *
        FROM elections
        WHERE id = $1
        FOR UPDATE
        `,
        [electionId]
    )

    if (!rows.length) return

    const election = rows[0]
    const expectedStatus = getExpectedStatus(election, now)

    if (expectedStatus === election.status) return

    const currentIndex = STATUS_ORDER.indexOf(election.status)
    const expectedIndex = STATUS_ORDER.indexOf(expectedStatus)

    // no backward / same update
    if (expectedIndex <= currentIndex) return

    // update status
    await client.query(
        `
        UPDATE elections
        SET status = $1
        WHERE id = $2
        `,
        [expectedStatus, electionId]
    )

    // fetch users for user id to send notifications
    const { rows: users } = await client.query(
        `SELECT u.id, u.role, CASE WHEN t.user_id IS NOT NULL THEN true ELSE false END AS is_tutor FROM users u LEFT JOIN teachers t ON t.user_id = u.id`
    )

    // send status update notifications to users
    const statusMessage = STATUS_MESSAGES[expectedStatus]

    if (statusMessage) {
        const userIds = users.map((u) => u.id)

        await sendNotification(
            userIds,
            { message: statusMessage, type: "info" },
            client
        )
    }

    // send deadline notifications
    const nowMs = now.getTime()

    const nominationEnd = new Date(election.nomination_end).getTime()
    const votingStart = new Date(election.voting_start).getTime()

    const nomination24h = isWithinWindow(nominationEnd, nowMs, 24 * MS.HOUR)
    const nomination1h = isWithinWindow(nominationEnd, nowMs, 1 * MS.HOUR)

    const votingStart24h = isWithinWindow(votingStart, nowMs, 24 * MS.HOUR)
    const votingStart1h = isWithinWindow(votingStart, nowMs, 1 * MS.HOUR)

    const students = []
    const tutors = []
    const otherNonStudents = []

    for (const user of users) {
        if (user.role === "student") {
            students.push(user.id)
        } else if (user.is_tutor) {
            tutors.push(user.id)
        } else {
            otherNonStudents.push(user.id)
        }
    }

    // Nomination end reminders
    if (nomination24h || nomination1h) {
        const key = nomination24h ? "24h" : "1h"

        await sendNotification(
            students,
            {
                message: REMINDER_MESSAGES.nomination.student[key],
                type: "warning"
            },
            client
        )

        await sendNotification(
            tutors,
            {
                message: REMINDER_MESSAGES.nomination.tutor[key],
                type: "warning"
            },
            client
        )

        await sendNotification(
            otherNonStudents,
            { message: REMINDER_MESSAGES.nomination.other[key], type: "info" },
            client
        )
    }

    // Voting start reminders
    if (votingStart24h || votingStart1h) {
        const key = votingStart24h ? "24h" : "1h"
        const message = REMINDER_MESSAGES.votingStart.all[key]

        const allUsers = [...students, ...tutors, ...otherNonStudents]

        await sendNotification(allUsers, { message, type: "info" }, client)
    }
}
