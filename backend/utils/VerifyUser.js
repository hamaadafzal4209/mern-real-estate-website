import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Check if the token is present in cookies
    const token = req.cookies.access_token;

    if (!token) {
        // If token is not present, return unauthorized error
        return next(errorHandler(401, 'Unauthorized'));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
        if (err) {
            // If token verification fails, return forbidden error
            return next(errorHandler(403, 'Forbidden'));
        }

        // Token is valid, attach the user object to the request for further processing
        req.user = decoded;
        next();
    });
}
