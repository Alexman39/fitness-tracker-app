import {useEffect, useState} from "react";
import { db } from "@/firebase";
import {collection, addDoc, doc, setDoc} from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "@/AuthContext";
import toast from "react-hot-toast";

export default function WorkoutForm({ onSave, workoutToEdit }) {
    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState(workoutToEdit ? workoutToEdit.name : "");
    const [exercises, setExercises] = useState(workoutToEdit ? workoutToEdit.exercises : []);

    const handleAddExercise = () => {
        setExercises([
            ...exercises,
            {
                name: "",
                sets: [], // each set is a separate number of reps
            },
        ]);
    };

    const handleExerciseNameChange = (index, value) => {
        const updated = [...exercises];
        updated[index].name = value;
        setExercises(updated);
    };

    const handleSetCountChange = (index, value) => {
        const count = parseInt(value);
        const updated = [...exercises];
        updated[index].sets = Array(count).fill("");
        setExercises(updated);
    };

    const handleRepsChange = (exerciseIndex, setIndex, value) => {
        const updated = [...exercises];
        updated[exerciseIndex].sets[setIndex] = value;
        setExercises(updated);
    };

    const handleRemoveExercise = (indexToRemove) => {
        if (confirm("Are you sure you want to delete this exercise?")) {
            const updated = exercises.filter((_, index) => index !== indexToRemove);
            setExercises(updated);
        }
    };

    const handleSaveWorkout = async () => {
        if (!name || exercises.length === 0) {
            alert("Please add a name and at least one exercise.");
            return;
        }

        const workoutData = {
            name,
            exercises,
            userId: currentUser.uid,
            updatedAt: new Date(),
        };

        try {
            if (workoutToEdit) {
                // Update existing workout
                const docRef = doc(db, "customWorkouts", workoutToEdit.id);
                await setDoc(docRef, workoutData);
            } else {
                // Add new workout
                await addDoc(collection(db, "customWorkouts"), workoutData);
            }

            toast.success("Workout saved successfully!");
            onSave();
        } catch (err) {
            console.error("Error saving workout:", err);
            toast.error("Failed to save workout.");
        }
    };

    useEffect(() => {
        if (workoutToEdit) {
            setName(workoutToEdit.name);
            setExercises(workoutToEdit.exercises);
        }
    }, [workoutToEdit]);




    return (
        <div className="p-4 border rounded bg-white shadow">
            <h2 className="text-lg font-bold mb-2">Create a New Workout</h2>

            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Workout name"
                className="w-full mb-4 p-2 border rounded"
            />

            {exercises.map((exercise, index) => (
                <div key={index} className="mb-4 p-2 border rounded">
                    <input
                        type="text"
                        placeholder="Exercise name"
                        value={exercise.name}
                        onChange={e => handleExerciseNameChange(index, e.target.value)}
                        className="w-full p-1 mb-2 border rounded"
                    />

                    <input
                        type="number"
                        placeholder="Number of sets"
                        onChange={e => handleSetCountChange(index, e.target.value)}
                        className="w-full p-1 mb-2 border rounded"
                    />

                    <div className="flex flex-wrap gap-2">
                        {exercise.sets.map((rep, setIndex) => (
                            <input
                                key={setIndex}
                                type="number"
                                placeholder={`Reps for Set ${setIndex + 1}`}
                                value={rep}
                                onChange={e =>
                                    handleRepsChange(index, setIndex, e.target.value)
                                }
                                className="w-24 p-1 border rounded"
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => handleRemoveExercise(index)}
                        className="mt-2 text-red-600 hover:underline"
                    >
                        Delete Exercise
                    </button>

                </div>
            ))}

            <button
                onClick={handleAddExercise}
                className="mt-2 mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                + Add Exercise
            </button>

            <button
                onClick={handleSaveWorkout}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Save Workout
            </button>
        </div>
    );


}
