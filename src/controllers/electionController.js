import * as electionService from "../services/electionService.js"

export const getElections = async (req, res, next) => {
    try {
        const elections = await electionService.getElections()

        return res.status(200).json(elections)
    } catch (err) {
        next(err)
    }
}
