import { Schema } from "mongoose";

export interface ITopics extends Document {
    phishing: string,
    scams: string,
    peer_pressure: string,
    cyber_bullying: string,
    online_content: string,
    online_dating: string,
    priv_settings: string,
    malware: string,
    online_predators: string,
}

export const topicSchema = new Schema<ITopics>({
    phishing: {type: String, required: true},
    scams: {type: String, required: true},
    peer_pressure: {type: String, required: true},
    cyber_bullying: {type: String, required: true},
    online_predators: {type: String, required: true},
    online_dating: {type: String, required: true},
    online_content: {type: String, required: true},
    malware: {type: String, required: true},
    priv_settings: {type: String, required: true},
})

