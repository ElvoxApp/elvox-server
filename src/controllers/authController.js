import * as authService from "../services/authService.js"

export const getInfo = async (req, res, next) => {
    try {
        const data = await authService.getInfo(req.body)
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}

export const getOtp = async (req, res, next) => {
    try {
        const data = await authService.getOtp(req.body)
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}

export const verifyOtp = async (req, res, next) => {
    try {
        const data = await authService.verifyOtp(req.body)
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}

export const signup = async (req, res, next) => {
    try {
        const { user, token } = await authService.signup(req.body)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json(user)
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const { user, token } = await authService.login(req.body)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}
