import { calculateBMR } from "./bmr";
import { calculateTDEE } from "./tdee";
import { generateMacros } from "./macros";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function generateAndSavePlan(profile, userId) {
    const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
    const tdee = calculateTDEE(bmr, profile.activityLevel);

    const weeks = parseInt(profile.goalDuration);
    const weightDiff = Math.abs(profile.weight - profile.targetWeight);
    const calories = calculateDailyCalories(tdee, profile.goal, weightDiff, weeks);
    const macros = generateMacros(profile.weight, calories);

    const plan = {
        bmr,
        tdee: Math.round(tdee),
        calories,
        macros,
        planStartDate: new Date(),
        goal: profile.goal,
        targetWeight: profile.targetWeight,
        trainingFrequency: profile.trainingFrequency,
        experienceLevel: profile.experienceLevel,
    };

    await setDoc(doc(db, "plans", userId), plan);

    console.log("Generated Plan:", plan);

}

// Optional: You could move calculateDailyCalories to a separate utils file too
function calculateDailyCalories(tdee, goal, weightDiffKg, weeks) {
    const totalCalChange = weightDiffKg * 7700;
    const dailyAdjustment = totalCalChange / (weeks * 7);

    if (goal === "cut") return Math.round(tdee - dailyAdjustment);
    if (goal === "bulk") return Math.round(tdee + dailyAdjustment);
    return Math.round(tdee); // maintain
}