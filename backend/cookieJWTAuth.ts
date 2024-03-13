import jwt, { JwtPayload } from "jsonwebtoken"
import {Request, Response, NextFunction } from "express"

export interface IGetAuthenticatedRequest extends Request {
    user?: string | JwtPayload
}

export const cookieJWTAuth = (req: IGetAuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({error: "Unauthorised access"})
    }
    try {
        if (process.env.SECRET_KEY) {
            const user = jwt.verify(token,process.env.SECRET_KEY) as string | JwtPayload
            req.user = user
            next()
        }
    } catch (error) {
        res.clearCookie("token")
        res.status(401).json({error: "Cookie either outdated or not verifiable"})
    }
}

