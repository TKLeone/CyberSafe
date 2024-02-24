import jwt, { JwtPayload } from "jsonwebtoken"
import {Request, Response, NextFunction } from "express"

export interface IGetAuthenticatedRequest extends Request {
    user: string | JwtPayload
}

// TODO: test whether this works and loading of a site
const cookieJWTAuth = (req: IGetAuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        res.status(401).json({error: "Unauthorised access"})
    }

    try {
        if (process.env.secretKey) {
            const user = jwt.verify(token, process.env.secretKey)
            req.user = user
            next()
        }
    } catch (error) {
        res.clearCookie("token")
        return res.redirect("/")
    }
}

export default cookieJWTAuth
