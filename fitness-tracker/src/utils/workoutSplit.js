export function getSplitForFrequency(freq) {
    switch (parseInt(freq)) {
        case 3:
            return ["Push", "Pull", "Legs", "Rest", "Push", "Rest", "Rest"];
        case 4:
            return ["Upper", "Lower", "Rest", "Push", "Pull", "Rest", "Rest"];
        case 5:
            return ["Push", "Pull", "Legs", "Upper", "Lower", "Rest", "Rest"];
        case 6:
            return ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"];
        default:
            return ["Full Body", "Rest", "Full Body", "Rest", "Full Body", "Rest", "Rest"];
    }
}

export function getTodayWorkout(planStartDate, trainingFrequency) {
    if (!planStartDate || !trainingFrequency) return "N/A";

    // Convert Firestore Timestamp to JS Date
    const startDate = planStartDate.toDate ? planStartDate.toDate() : new Date(planStartDate);
    const today = new Date();

    const daysSinceStart = Math.floor(
        (today - startDate) / (1000 * 60 * 60 * 24)
    );

    const split = getSplitForFrequency(trainingFrequency);
    return split[daysSinceStart % 7];
}
