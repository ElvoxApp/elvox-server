const errorHandler = (err, req, res, next) => {
    const status = err.status || 500
    res.status(status).json({
        error: err.message || "Internal Server Error",
        code: err.code || null
    })
}

export default errorHandler
