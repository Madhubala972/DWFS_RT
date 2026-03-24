const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // Extract specific validation messages if needed, or just use default
        message = Object.values(err.errors).map(val => val.message).join(', ');
        console.error('Validation Error:', message);
    } else {
        console.error('SERVER ERROR:', err);
    }

    res.status(statusCode);
    res.json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
