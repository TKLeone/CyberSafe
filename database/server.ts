import express, {Request, Response} from "express"
import mongoose, {Document, Schema, Model, CallbackError} from "mongoose"
import bcrypt from "bcrypt"
const app = express()
const port = 3000

mongoose.connect("mongodb://localhost:3000/users")

interface I_users extends Document {
    username: string,
    password: string,
    email: string
}

const userSchema = new Schema<I_users>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
})

const user: Model<I_users> = mongoose.model("user", userSchema)

userSchema.pre<I_users>("save", async function (next) {
    const user: I_users = this
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
        return next(new Error("An unkown error occured"))
    }
})

app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await user.find()
        res.json(users)
    } catch(err) {
        res.status(500).send(err)
    }
})

app.listen(port, () => {
    console.log("Server is running on port ${port}")
})

userSchema.methods.comparePassword = async function (newPassword: string) {
    return bcrypt.compare(newPassword, this.password)
}
