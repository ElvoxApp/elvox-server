import * as departmentService from "../services/departmentService.js"

export const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentService.getDepartments()

        res.status(200).json(departments)
    } catch (err) {
        next(err)
    }
}
