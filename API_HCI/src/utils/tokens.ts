import * as jwt from 'jsonwebtoken';

export function generateAuthenticationToken(
    userId: number
): string {
    return jwt.sign(
            { sub: userId, iat: Date.now() },
            process.env.JWT_TOKEN,
            { expiresIn: "30d" }
          );
}

export function validateAuthenticationToken(
    token: string
): number | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN) as jwt.JwtPayload;
        if (!decoded.sub) return null;
        return parseInt(decoded.sub as string);
    } catch(err: unknown) {
        if (err instanceof jwt.JsonWebTokenError) return null;
    }
}