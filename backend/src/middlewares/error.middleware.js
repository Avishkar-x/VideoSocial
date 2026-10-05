import { ApiError } from "../utils/ApiError.js"

const errorHandler = (err, req, res, next) => {
    // If it's one of our own ApiError instances, use its fields directly.
    // Otherwise fall back to generic 500 values.
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: err.success,
            message: err.message,
            errors: err.errors,
        })
    }

    // Unhandled / unexpected errors
    return res.status(500).json({
        statusCode: 500,
        success: false,
        message: err?.message || "Internal Server Error",
        errors: [],
    })
}

export { errorHandler }
