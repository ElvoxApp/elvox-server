import * as userService from "../services/userService.js"

export const checkUserExists = async (req, res, next) => {
    try {
        const data = await userService.checkUserExists(req.query)

        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const data = await userService.updatePassword({
            ...req.body,
            id: req.user.id
        })

        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.userId)

        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}
