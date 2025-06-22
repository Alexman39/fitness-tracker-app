import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export const logWorkoutCompletion = async (userId, workoutName) => {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-06-11"

    try {
        const ref = doc(db, "workoutLogs", `${userId}_${today}`);
        await setDoc(ref, {
            userId,
            workoutName,
            date: today,
            completed: true,
            timestamp: new Date()
        });
        console.log("Workout logged!");
    } catch (err) {
        console.error("Error logging workout:", err);
    }
};
