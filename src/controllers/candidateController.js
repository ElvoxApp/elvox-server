import * as candidateService from "../services/candidateService.js"

export const createCandidate = async (req, res, next) => {
    try {
        const data = await candidateService.createCandidate({
            user: req.user,
            body: req.body,
            files: req.files
        })

        res.status(201).json(data)
    } catch (err) {
        next(err)
    }
}
