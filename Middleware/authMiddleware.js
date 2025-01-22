
const jwt = require('jsonwebtoken');
const sendResponse = require('../Utils/Response');

function auth(req, res, next) {
    let token = req.body.token || req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    // console.log('Token : ', token);

    if (!token) {
        return sendResponse(res, 401, false, "No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return sendResponse(res, 401, false, "Token expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return sendResponse(res, 401, false, "Invalid token");
        }
        sendResponse(res, 500, false, "Internal server error");
    }
}

module.exports = auth;
