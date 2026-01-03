import CustomError from "../utils/CustomError.js"

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return next(new CustomError("Not authenticated", 401))

        const { role, tutor_of } = req.user

        const isAuthorized =
            allowedRoles.includes(role) ||
            (allowedRoles.includes("tutor") && tutor_of !== null)

        if (!isAuthorized) return next(new CustomError("Forbidden", 403))

        next()
    }
}

export default requireRole
