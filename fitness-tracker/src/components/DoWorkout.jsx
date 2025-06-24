import { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "@/AuthContext";
import { useContext } from "react";
import toast from "react-hot-toast";

export default function DoWorkout({ workout, onFinish, onDiscard }) {
    const { currentUser } = useContext(AuthContext);
    const [actualReps, setActualReps] = useState(() =>
        workout.exercises.map(ex => ex.sets.map(rep => rep)) // pre-fill with planned reps
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
        <div className="p-4 bg-white text-black">
            <h2 className="text-2xl font-bold mb-6">Log Your Workout: {workout.name}</h2>

            {workout.exercises.map((ex, exIndex) => (
                <div key={exIndex} className="mb-6 p-4 border rounded-3xl shadow bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2">{ex.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Planned Sets: {ex.sets.length}</p>

                    <div className="flex flex-wrap gap-4">
                        {ex.sets.map((plannedReps, setIndex) => (
                            <div key={setIndex} className="flex flex-col w-24">
                                <label className="text-xs text-gray-500 mb-1 text-center">
                                    Set {setIndex + 1} <br /> (Planned: {plannedReps} reps)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={actualReps[exIndex][setIndex]}
                                    onChange={e => handleRepChange(exIndex, setIndex, e.target.value)}
                                    className="p-1 border rounded text-center"
                                />
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-gray-600 mt-4">
                        <span className="font-semibold">Planned Total:</span> {ex.sets.reduce((sum, r) => sum + parseInt(r || 0), 0)} reps |
                        <span className="font-semibold ml-2">Actual Total:</span> {actualReps[exIndex].reduce((sum, r) => sum + parseInt(r || 0), 0)} reps
                    </p>
                </div>
            ))}

            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700"
                >
                    Save Workout Log
                </button>

            </div>
        </div>
    );
}