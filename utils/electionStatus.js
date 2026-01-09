export const STATUS_ORDER = [
    "draft",
    "nominations",
    "pre-voting",
    "voting",
    "post-voting",
    "closed"
]

export const getExpectedStatus = (election, now = new Date()) => {
    if (now < election.nomination_start) return "draft"
    if (now < election.nomination_end) return "nominations"
    if (now < election.voting_start) return "pre-voting"
    if (now < election.voting_end) return "voting"
    if (now < election.election_end) return "post-voting"
    return "closed"
}
