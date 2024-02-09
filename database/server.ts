import express, {Request, Response} from "express"
import mongoose, {Document, Schema, Model, CallbackError} from "mongoose"
import bcrypt from "bcrypt"
import cors from "cors"
const app = express()
const port = 8001

mongoose.connect("mongodb://127.0.0.1:27017/users")

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

const User: Model<I_users> = mongoose.model("user", userSchema)

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

app.use(cors())
app.use(express.json())

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
        const { username, password, email } = req.body;
        const newUser = new User({ username, password, email });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

userSchema.methods.comparePassword = async function (newPassword: string) {
    return bcrypt.compare(newPassword, this.password)
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

