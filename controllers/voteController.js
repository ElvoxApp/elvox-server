import * as voteService from "../services/voteService.js"

export const castVote = async (req, res, next) => {
    try {
        await voteService.castVote(req.params.id, req.body)

        res.status(204).end()
    } catch (err) {
        next(err)
    }
}
