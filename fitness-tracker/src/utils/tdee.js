export function getActivityMultiplier(level) {
    switch (level) {
        case "sedentary": return 1.2;
        case "light": return 1.375;
        case "moderate": return 1.55;
        case "active": return 1.725;
        case "very_active": return 1.9;
        default: return 1.55;
    }
}

export function calculateTDEE(bmr, activityLevel) {
    return bmr * getActivityMultiplier(activityLevel);
}
