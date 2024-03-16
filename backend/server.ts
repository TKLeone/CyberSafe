import express, {Request, Response} from "express"
import mongoose, {Document, Schema, Model, CallbackError} from "mongoose"
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {cookieJWTAuth, IGetAuthenticatedRequest} from "./cookieJWTAuth"
import { ITopics, topicSchema} from "./topicDB"
import { topicValidation} from "./topicValidation"
import OpenAI from "openai"

dotenv.config()
const app = express()
const port = 8001

// NOTE: see if devweb hosting works
const userConn = mongoose.createConnection("mongodb://127.0.0.1:27017/users")

interface IUsers extends Document {
    password: string,
    email: string,
    ageRange: string,
    gender: string,
}

const userSchema = new Schema<IUsers>({
    password: {type: String, required: true},
    email: {type: String, required: true},
    ageRange: {type: String, required: true},
    gender: {type: String, required: true}
})

userSchema.pre<IUsers>("save", async function (next) {
    const user: IUsers = this
    if (!user.isModified("password")) return next()

    const saltRounds: number = 10
    try {
        const hash = await bcrypt.hash(user.password, saltRounds)
        user.password = hash
        next()
    } catch (err) {
        if (err instanceof Error) {
            return next(err as CallbackError)
        }
        return next(new Error("An unknown error occured"))
    }
})

const User: Model<IUsers> = userConn.model("users", userSchema)

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.post("/users", async (req: Request, res: Response) => {
    try {
        let {password, email, ageRange, gender} = req.body
        email = email.toLowerCase()

        const existingUser =  await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({email: "Email already exists"})
        }

        const newUser = new User({password, email: email, ageRange, gender})
        await newUser.save()
    } catch (err) {
        console.error(err)
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
        const secretKey: string = process.env.SECRET_KEY as string;
        try {
            if(secretKey){
                const token = jwt.sign({user}, secretKey, { expiresIn: '1d' })
                // TODO: see if expo-secure-storage works better
                res.cookie("token", token, {
                    httpOnly: true,
                })

                return res.status(200).json({message: "Login successful"})
            } else {
                return res.status(500).json({error: "JWT signing error"})
            }
        } catch (error) {
            return res.status(500).json({error: "JWT signing error"})
        }
    }
})


userSchema.methods.comparePassword = async function (newPassword: string) {
    return bcrypt.compare(newPassword, this.password)
}

app.post("/validateJWT", cookieJWTAuth, (req: IGetAuthenticatedRequest, res: Response) => {})

app.get("/ageRange", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
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
    let {label, ageRange} = req.body
    const userAgeRange = await User.findOne({ageRange})
    let newAgeRange = ""
    if (userAgeRange) {
        newAgeRange = userAgeRange.get("ageRange")
    }

    label = topicValidation(label)
    // NOTE: test caching or other methods to improve performance / db load
    let topicData = await Topic.findOne({[label]: {$exists: true}})
    if (topicData) {
        const topic = topicData.get(label)
        const extraInfo = topicData.get("extra_info")
        res.send({topic,extraInfo})
    } else {
        res.status(500).json({error: "Internal Server Error"})
    }
})

const openai = new OpenAI()

app.post("/api/openAI", cookieJWTAuth, async (req: IGetAuthenticatedRequest, res: Response) => {
    const test = req.body
    try {
        console.log("openai thing hits")
        const completion = await openai.chat.completions.create({
            messages:[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": test.question},
            ],
            model: "gpt-3.5-turbo",
        })
        const response = completion.choices[0].message.content
        res.send(response)
    } catch (err) {
        res.status(400).json({error: "Can't connect to openAI api"})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
