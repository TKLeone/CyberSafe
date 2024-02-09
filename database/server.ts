import express, {Request, Response} from "express"
import mongoose, {Document, Schema, Model, CallbackError} from "mongoose"
import bcrypt from "bcrypt"
import cors from "cors"
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
        return next(new Error("An unkown error occured"))
    }
})

const User: Model<IUsers> = mongoose.model("user", userSchema)

app.use(cors())
app.use(express.json())

// probably remove this later so i don't expose the whole db lmfao
app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).send(err)
    }
})

// TODO: more database validations
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
