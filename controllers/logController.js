import * as logService from "../services/logService.js"

export const getLogs = async (req, res, next) => {
    try {
        const data = await logService.getLogs(req.params.id, req.query.range)

        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}
