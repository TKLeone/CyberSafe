export const topicValidation = (label: string, ageRange: string) => {
    if (label === "Phishing") {
        label = "phishing"
        return label
    }

    return label
}
