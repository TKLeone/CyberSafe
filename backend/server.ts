/* eslint-disable prefer-const */
import express, {Request, Response} from "express"
import mongoose, {Document, Schema, Model, CallbackError} from "mongoose"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import cors from "cors"
import dotenv from "dotenv"
import {cookieJWTAuth, IGetAuthenticatedRequest} from "./cookieJWTAuth"
import { ITopics, topicSchema} from "./topicDB"
import { topicValidation} from "./topicValidation"
import OpenAI from "openai"

dotenv.config()
dotenv.config({path: "../.env"})
const app = express()
const port = 8001

// NOTE: see if devweb hosting works
const userConn = mongoose.createConnection("mongodb://127.0.0.1:27017/users")

interface IUsers extends Document {
    password: string,
    email: string,
    ageRange: string,
}

const userSchema = new Schema<IUsers>({
    password: {type: String, required: true},
    email: {type: String, required: true},
    ageRange: {type: String, required: true},
})

userSchema.pre<IUsers>("save", async function (next) {
    if (!this.isModified("password")) return next()

    const saltRounds: number = 10
    try {
        const hash = await bcrypt.hash(this.password, saltRounds)
        this.password = hash
        next()
    } catch (err) {
        if (err instanceof Error) {
            return next(err as CallbackError)
        }
        return next(new Error("An unknown error occured"))
    }
})

userSchema.methods.comparePassword = async function (newPassword: string) {
return bcrypt.compare(newPassword, this.password)
}

const User: Model<IUsers> = userConn.model("users", userSchema)

app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json())

app.post("/users", async (req: Request, res: Response) => {
    try {
        let {password, email, ageRange} = req.body
        email = email.toLowerCase()
        const existingUser =  await User.findOne({email})

        if (existingUser) {
            return res.status(400).json({email: "Email already exists"})
        }

        const newUser = new User({password, email: email, ageRange})
        await newUser.save()
        res.status(200).json({message: "Registered Account"})
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

app.post("/login", async (req: Request, res: Response) => {
    let {email, password} = req.body
    email = email.toLowerCase()

    const user = await User.findOne({email:email})
    if (!user) {
        res.status(401).json({error: "Email can't be found"})
    } else {
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({error: "Password can't be found"})
        }
        const secretKey: string = process.env.SECRET_KEY as string
        try {
            if(secretKey){
                const token = jwt.sign({user}, secretKey, { expiresIn: "5m" })

                return res.send(token).status(200)
            } else {
                return res.status(500).json({error: "JWT signing error"})
            }
        } catch (err) {
            return res.status(500).json({error: "JWT signing error"})
        }
    }
})

app.post("/validateJWT", cookieJWTAuth, (req: IGetAuthenticatedRequest, res: Response) => {
    res.status(200).json({message: "Successful Validation"})
})

app.post("/getAccountInfo", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    try {
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload
            const data = await User.findById(user.user._id).select("email ageRange -_id")
            if (data) {
                res.json(data)
            } else {
                res.status(401).json({error: "Can't get user from database"})
            }
        } else {
            res.status(401).json({error: "User can't be foundd"})
        }
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.post("/deleteaccount", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    try {
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload
            const doc = await User.findById(user.user._id)
            if (doc) {
                const checkDeletion = await doc?.deleteOne()
                if (checkDeletion.deletedCount > 0) {
                    res.status(200).json({message: "Account deleted"})
                } else {
                    res.status(500).json({error: "Account was not deleted"})
                }
            } else {
                res.status(500).json({error: "Account not found"})
            }
        }
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.post("/ageRange", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    try {
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload
            const data = await User.findById(user.user._id).select("ageRange -_id")
            res.json(data)
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({error: "Internal Server Error"})
    }
})

const Topic: Model<ITopics> = userConn.model("topics", topicSchema)

app.post("/getTopicData", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    let {label} = req.body
    label = topicValidation(label)
    const topicData = await Topic.findOne({[label]: {$exists: true}})
    if (topicData) {
        const topic = topicData.get(label)
        const extraInfo = topicData.get("extra_info")
        res.send({topic,extraInfo})
    } else {
        res.status(500).json({error: "Internal Server Error"})
    }
})

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

interface IResponse extends Document{
    userId: Schema.Types.ObjectId
    info: string
}

const responseSchema = new Schema<IResponse>({
    userId: {type: Schema.Types.ObjectId},
    info: {type: String, required: true}
})

const userResponse: Model<IResponse> = userConn.model("responses", responseSchema)

app.post("/api/openAI", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    const question = req.body
    let ageRange
    let doc
    try {
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload
            doc = await User.findById(user.user._id)
            ageRange = doc?.get("ageRange")
        }
    } catch(err) {
        res.status(500).json({error: "Internal Server Error"})
    }
    let message = ""
    switch (ageRange) {
        case "13-14": message = "You are an expert cybersecurity specialist. Your information should come from the National Cyber Security Centre by the United Kingdom and the Cybersecurity and Infrastructure Security Agency by the United States of America. You will only provide responses that relate to cybersecurity. Use real world examples catered for teenagers aged 13-14 for the response you give. "; break
        case "15-16": message = "You are an expert cybersecurity specialist. Your information should come from the National Cyber Security Centre by the United Kingdom and the Cybersecurity and Infrastructure Security Agency by the United States of America. You will only provide responses that relate to cybersecurity. Use real world examples catered for teenagers aged 15-16 for the response you give. "; break
        case "17-19": message = "You are an expert cybersecurity specialist. Your information should come from the National Cyber Security Centre by the United Kingdom and the Cybersecurity and Infrastructure Security Agency by the United States of America. You will only provide responses that relate to cybersecurity. Use real world examples catered for teenagers aged 17-19 for the response you give. "; break
        default: message = "You are an expert cybersecurity specialist. Your information should come from the National Cyber Security Centre by the United Kingdom and the Cybersecurity and Infrastructure Security Agency by the United States of America. You will only provide responses that relate to cybersecurity. Use real world examples catered for teenagers for the response you give. "; break
    }
    try {
        const moderation = await openai.moderations.create({input: question.question})
        if (moderation.results[0].flagged === true) {
            res.send("Your question has been flagged under moderations. Ask a cyber security question instead.")
        } else {
            const completion = await openai.chat.completions.create({
                messages:[
                    {"role": "system", "content": message},
                    {"role": "user", "content": question.question},
                ],
                model: "gpt-3.5-turbo",
            })
            const response = completion.choices[0].message.content
            const userId = doc?.get("_id")
            const getResponse = await userResponse.findOne({userId: userId})

            if (!getResponse) {
                const newResponse = new userResponse({userId, info: response})
                newResponse.save()
            } else {
                let getInfo = getResponse?.get("info")
                if (getInfo) {
                    getInfo += `\n\n\n${response}`
                    getResponse.set("info", getInfo)
                    await getResponse.save()
                }
            }
            res.status(200).send(response)
        }
    } catch (err) {
        res.status(400).json({error: "Can't connect to openAI api"})
    }
})

app.post("/getResponse", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    try {
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload
            const data = await User.findById(user.user._id)
            const userId = data?.get("_id")
            const getResponse = await userResponse.findOne({userId: userId})
            if (!getResponse) {
                return res.send("empty")
            }
            const info = getResponse?.get("info")
            res.status(200).json({info})
        } else {
            res.status(500).json({error: "can't find user"})
        }
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.post("/deleteResponse", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    try {
        if (req.user) {
            const user: JwtPayload = req.user as JwtPayload
            const doc = await User.findById(user.user._id)
            const userId = doc?.get("_id")
            if (userId) {
                const getResponse = await userResponse.findOne({userId: userId})
                if (getResponse) {
                    const checkDeletion =  await getResponse.deleteOne()
                    if (checkDeletion.deletedCount > 0) {
                        res.status(200).json({message: "Responses deleted"})
                    } else {
                        res.status(500).json({error: "Could not delete"})
                    }
                } else {
                    res.status(500).json({error: "Could not get response document"})
                }
            } else {
                res.status(500).json({error: "Could not find user"})
            }
        } else {
            res.status(500).json({error: "User seemingly doesn't exist"})
        }
    } catch (err) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

export default app
