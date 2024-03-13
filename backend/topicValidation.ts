export const topicValidation = (label: string) => {
    if (label === "Phishing") {
        return "phishing"
    }
    if (label === "Identifying scams") {
        return "scams"
    }
    if (label === "Peer Pressure") {
        return "peer_pressure"
    }
    if (label === "Online Predators") {
        return "online_predators"
    }
    if (label === "Malware") {
        return "malware"
    }
    if (label === "Privacy Settings") {
        return "priv_settings"
    }
    if (label === "Online Content") {
        return "online_content"
    }
    if (label === "Cyber-bullying") {
        return "cyber_bullying"
    }

    return label
}
