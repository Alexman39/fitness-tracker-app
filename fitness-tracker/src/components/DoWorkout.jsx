import { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "@/AuthContext";
import { useContext } from "react";
import toast from "react-hot-toast";

export default function DoWorkout({ workout, onFinish }) {
    const { currentUser } = useContext(AuthContext);
    const [actualReps, setActualReps] = useState(() =>
        workout.exercises.map(ex =>
            ex.sets.map(rep => rep) // pre-fill with planned reps
        )
    );

    const handleRepChange = (exIndex, setIndex, value) => {
        const updated = [...actualReps];
        updated[exIndex][setIndex] = value;
        setActualReps(updated);
    };

    const handleSubmit = async () => {
        const completedData = {
            userId: currentUser.uid,
            workoutName: workout.name,
            originalWorkoutId: workout.id,
            completedExercises: workout.exercises.map((ex, exIndex) => ({
                name: ex.name,
                planned: ex.sets,
                actual: actualReps[exIndex],
            })),
            completedAt: new Date(),
        };

        try {
            await addDoc(collection(db, "completedWorkouts"), completedData);
            toast.success("Workout logged successfully!");
            onFinish();
        } catch (err) {
            console.error("Error logging workout:", err);
            toast.error("Failed to log workout.");
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Log Your Workout: {workout.name}</h2>

            {workout.exercises.map((ex, exIndex) => (
                <div key={exIndex} className="mb-4">
                    <h3 className="font-semibold">{ex.name}</h3>

                    <div className="flex gap-2 flex-wrap">
                        {ex.sets.map((plannedReps, setIndex) => (
                            <input
                                key={setIndex}
                                type="number"
                                placeholder={`Set ${setIndex + 1} (planned: ${plannedReps} reps)`}
                                value={actualReps[exIndex][setIndex]}
                                onChange={e => handleRepChange(exIndex, setIndex, e.target.value)}
                                className="w-36 p-1 border rounded"
                            />
                        ))}
                    </div>

                    {/* ✅ Add this summary block right here */}
                    <p className="text-sm text-gray-600 mt-2">
                        Planned total: {ex.sets.reduce((sum, r) => sum + parseInt(r || 0), 0)} reps |
                        Actual total: {actualReps[exIndex].reduce((sum, r) => sum + parseInt(r || 0), 0)} reps
                    </p>
                </div>
            ))}

            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Save Workout Log
            </button>
        </div>
    );
}
