import express, {NextFunction, Request, Response} from "express"
import mongoose, {Document, Schema, Model, CallbackError} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {cookieJWTAuth, IGetAuthenticatedRequest} from "./cookieJWTAuth"

dotenv.config()
const app = express()
const port = 8001

mongoose.connect("mongodb://127.0.0.1:27017/users")

interface IUsers extends Document {
    username: string,
    password: string,
    email: string
}

const userSchema = new Schema<IUsers>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
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

const User: Model<IUsers> = mongoose.model("user", userSchema)

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())

// TODO: probably remove this later so i don't expose the whole db lmfao
app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).send(err)
    }
})

app.post("/users", async (req: Request, res: Response) => {
    try {
        let { username, password, email } = req.body;
        email = email.toLowerCase()

        const existingUser =  await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({email: "Email already exists"})
        }

        const newUser = new User({ username, password, email: email});
        await newUser.save();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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
        // FIXME: fix env stuff
        const secretKey: string = "test"
        try {
            if(secretKey){
                const token = jwt.sign({user}, secretKey, { expiresIn: '1m' });

                res.cookie("token", token, {
                    httpOnly: true,
                })

            } else {
                return res.status(500).json({error: "JWT signing error"})
            }
        } catch (error) {
            return res.status(500).json({error: "JWT signing error"})
        }
    }

    return res.status(200).json({message: "Login successful"})

})

app.post("/validateJWT", cookieJWTAuth, (req: IGetAuthenticatedRequest, res: Response) => {});

userSchema.methods.comparePassword = async function (newPassword: string) {
    return bcrypt.compare(newPassword, this.password)
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
