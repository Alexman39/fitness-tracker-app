export function generateMacros(weight, calories) {
    const protein = weight * 2; // grams
    const fat = (calories * 0.25) / 9; // grams
    const remainingCalories = calories - (protein * 4 + fat * 9);
    const carbs = remainingCalories / 4; // grams

    return {
        protein: Math.round(protein),
        fat: Math.round(fat),
        carbs: Math.round(carbs),
    };
}
