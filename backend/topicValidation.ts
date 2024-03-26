export const topicValidation = (label: string) => {
    switch (label) {
        case "PHISHING":
            return "phishing"
        case "IDENTIFYING SCAMS":
            return "scams"
        case "PEER PRESSURE":
            return "peer_pressure"
        case "ONLINE PREDATORS":
            return "online_predators"
        case "MALWARE":
            return "malware"
        case "PRIVACY SETTINGS":
            return "priv_settings"
        case "ONLINE CONTENT":
            return "online_content"
        case "CYBER BULLYING":
            return "cyber_bullying"
        case "ONLINE DATING":
            return "online_dating"
        case "ONLINE GAMING":
            return "online_gaming"
        default:
            return label
    }
}
