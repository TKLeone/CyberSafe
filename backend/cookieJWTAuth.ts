import jwt, { JwtPayload } from "jsonwebtoken"
import {Request, Response, NextFunction } from "express"

export interface IGetAuthenticatedRequest extends Request {
    user?: string | JwtPayload
}

export const cookieJWTAuth = (req: IGetAuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.body.token

    if (!token) {
        return res.status(401).json({error: "Unauthorised access"})
    }

    try {
        if (process.env.SECRET_KEY) {
            const user = jwt.verify(token,process.env.SECRET_KEY) as string | JwtPayload
            req.user = user
            next()
        } else {
            res.status(401).json({error: "key doesn't exist can't validate"})
        }
    } catch (err) {
        res.status(401).json({error: "Cookie either outdated or not verifiable"})
    }
}

