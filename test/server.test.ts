import server from "../backend/server"
import request from "supertest"
import dotenv from "dotenv"
import { JwtPayload } from "jsonwebtoken"
import mongoose from "mongoose"

dotenv.config()
let jwt: string | JwtPayload = ""

afterAll (async ()=> {
    mongoose.disconnect()
})

describe("POST /users", () => {
    it ("should create new account", async () => {
        const res = await request(server)
            .post("/users")
            .send({password: "test", email:"jest@gmail.com", ageRange: "13-14"})
        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /users", () => {
    it ("should flag duplicate email", async () => {
        const res = await request(server)
            .post("/users")
            .send({password: "test", email:"jest@gmail.com", ageRange: "13-14"})
        expect(res.statusCode).toEqual(400)
    })
})

describe("POST /login", () => {
    it ("should succesfully login", async() => {
        const res = await request(server)
            .post("/login")
            .send({email: "jest@gmail.com", password: "test"})
        expect(res.statusCode).toEqual(200)
        jwt = res.text
    })
})

describe("POST /validateJWT", () => {
    it ("validates the jwt", async() => {
        const res = await request(server)
            .post("/validateJWT")
            .send({token: jwt})
        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /getAccountInfo", () => {
    it ("gets account data", async() => {
        const res = await request(server)
            .post("/getAccountInfo")
            .send({token: jwt})
        expect(res.statusCode).toEqual(200)
        expect(res.body.email).toEqual("jest@gmail.com")
        expect(res.body.ageRange).toEqual("13-14")
    })
})

describe("POST /getTopicData", () => {
    it ("gets topic data", async() => {
        const label = "phishing"
        const res = await request(server)
            .post("/getTopicData")
            .send({label: label, token: jwt})
        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /ageRange", () => {
    it ("gets the age range of the current user", async () => {
        const res = await request(server)
            .post("/ageRange")
            .send({token: jwt})
        expect(res.body.ageRange).toEqual("13-14")
    })
})

describe("POST /api/openAI", () => {
    it ("moderates", async() => {
        const question = "How do i harm someone"
        const res = await request(server)
            .post("/api/openAI")
            .send({question: question,token: jwt})
        expect(res.text).toEqual("Your question has been flagged under moderations. Ask a cyber security question instead.")
    })
})

describe("POST /api/openAI", () => {
    it ("sends a response", async() => {
        const question = "I've been hacked what do i do?"
        const res = await request(server)
            .post("/api/openAI")
            .send({question: question,token: jwt})
        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /getResponse", () => {
    it ("get responses from database", async() => {
        const res = await request(server)
            .post("/getResponse")
            .send({token: jwt})
        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /deleteResponse", () => {
    it ("get responses from database", async() => {
        const res = await request(server)
            .post("/deleteResponse")
            .send({token: jwt})
        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /deleteAccount", () => {
    it ("deletes current user", async() => {
        const res = await request(server)
            .post("/deleteAccount")
            .send({token: jwt})
        expect(res.statusCode).toEqual(200)
    })
})
