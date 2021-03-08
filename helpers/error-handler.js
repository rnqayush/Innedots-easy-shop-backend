function errorHandler(err, req, res, next) {  // this is usually used for error handler. It was initially used in app.js for error handling 
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({message: err})
    }

    // default to 500 server error
    return res.status(500).json(err);
}

module.exports = errorHandler;