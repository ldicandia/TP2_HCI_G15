import { NextFunction, Request, Response } from "express";
import { PassportStatic } from "passport";
import { replyWithError } from "../http";
import { User } from "../entities/user";
import { tokenBlacklist } from "../controllers/user.controller";
import { UnauthorizedError } from "../types/error";
import { anonymousRoutes } from "../utils/endpoints";
import { validateAuthenticationToken } from "../utils/tokens";

export default function (
    passport: PassportStatic
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const originalUrl: string = req.originalUrl;
        const isAnonymous: boolean = anonymousRoutes.some(
            (route) => originalUrl.includes(route.path) &&
                (route.method == null || route.method == req.method)
        );
        if (isAnonymous) {
            next();
            return;
        }
        passport.authenticate('jwt', { session: false }, (err: any, user: Express.User | false | null) => {
            if (err || !user) {
                replyWithError(res, new UnauthorizedError());
                return;
            }
            if (!(user as User).isVerified) {
                replyWithError(res, new UnauthorizedError("User not verified."));
                return;
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError("Missing token.");

        if (tokenBlacklist.has(token)) throw new UnauthorizedError("Session expired, please log in again.");

        const userId = validateAuthenticationToken(token);
        if (!userId) throw new UnauthorizedError("Invalid token");

        const user = await User.findOneBy({ id: userId });
        if (!user) throw new UnauthorizedError("User not found.");

        req.user = user;
        next();
    } catch (err: unknown) {
        if (err instanceof UnauthorizedError) {
            res.status(401).json({ message: err.message });
            return;
        }
        res.status(500).json({ message: "Server error." });
    }
}