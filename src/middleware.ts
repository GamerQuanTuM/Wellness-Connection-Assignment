import { type Request, type Response, type NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

interface ExtendedRequest extends Request {
    user?: JwtPayload | string;
}

export function authenticateToken(req: ExtendedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token, return 401

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403); // If token invalid, return 403
        if (user) {
            req.user = user;
            next(); // If token valid, proceed to the next middleware
        } else {
            res.sendStatus(403); // If user is undefined, return 403
        }
    });
}
