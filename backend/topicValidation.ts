export const topicValidation = (label: string) => {
    switch (label) {
        case "Phishing":
            return "phishing"
        case "Identifying scams":
            return "scams"
        case "Peer Pressure":
            return "peer_pressure"
        case "Online Predators":
            return "online_predators"
        case "Malware":
            return "malware"
        case "Privacy Settings":
            return "priv_settings"
        case "Online Content":
            return "online_content"
        case "Cyber-bullying":
            return "cyber_bullying"
        case "Online Dating":
            return "online_dating"
        default:
            return label
    }
}
