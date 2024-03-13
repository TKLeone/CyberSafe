import { Schema } from "mongoose";

export interface ITopics extends Document {
    phishing: string,
    phishing15_16: string,
    phishing17_19: string,

    cyberbullying13_14: string,
    cyberbullying15_16: string,
    cyberbullying17_19: string,
}

export const topicSchema = new Schema<ITopics>({
    phishing: {type: String, required: true},
    phishing15_16: {type: String, required: true},
    phishing17_19: {type: String, required: true},

    cyberbullying13_14: {type: String, required: true},
    cyberbullying15_16: {type: String, required: true},
    cyberbullying17_19: {type: String, required: true},
})

