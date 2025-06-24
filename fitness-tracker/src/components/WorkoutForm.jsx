import {useEffect, useState} from "react";
import { db } from "@/firebase";
import {collection, addDoc, doc, setDoc} from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "@/AuthContext";
import toast from "react-hot-toast";

export default function WorkoutForm({ onSave, workoutToEdit, onCancel, mode = "create" }) {    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState(workoutToEdit ? workoutToEdit.name : "");
    const [exercises, setExercises] = useState(workoutToEdit ? workoutToEdit.exercises : []);

    const handleAddExercise = () => {
        setExercises([
            ...exercises,
            {
                name: "",
                sets: [],
                numberOfSets: 0 // ✅ New: directly store the number
            },
        ]);
    };

    const handleExerciseNameChange = (index, value) => {
        const updated = [...exercises];
        updated[index].name = value;
        setExercises(updated);
    };

    const handleSetCountChange = (index, value) => {
        const updated = [...exercises];

        // Allow empty input temporarily
        if (value === "") {
            updated[index].numberOfSets = value;
            setExercises(updated);
            return;
        }

        let count = parseInt(value);

        if (isNaN(count)) count = 1;
        if (count > 10) count = 10;

        updated[index].numberOfSets = count;

        if (updated[index].sets.length < count) {
            updated[index].sets = [...updated[index].sets, ...Array(count - updated[index].sets.length).fill("")];
        } else {
            updated[index].sets = updated[index].sets.slice(0, count);
        }

        setExercises(updated);
    };

    const handleRepsChange = (exerciseIndex, setIndex, value) => {
        const updated = [...exercises];
        updated[exerciseIndex].sets[setIndex] = value;
        setExercises(updated);
    };

    const handleRemoveExercise = (indexToRemove) => {
        toast((t) => (
            <div>
                <p className="font-semibold mb-2">Delete this exercise?</p>
                <div className="flex justify-end gap-4">
                    <button
                        className="text-gray-500 hover:underline"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                    <button
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => {
                            const updated = exercises.filter((_, index) => index !== indexToRemove);
                            setExercises(updated);
                            toast.dismiss(t.id);
                            toast.success("Exercise deleted.");
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: 8000 });
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
            const loadedExercises = workoutToEdit.exercises.map(ex => ({
                ...ex,
                numberOfSets: ex.sets.length
            }));
            setName(workoutToEdit.name);
            setExercises(loadedExercises);
        }
    }, [workoutToEdit]);




    return (
        <div className="m-4 rounded-3xl text-black relative">

            <h2 className="text-lg font-bold mb-2">
                {mode === "edit" ? "Edit Workout" : "Create a New Workout"}
            </h2>

            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Workout name"
                className="w-full mb-4 p-2 border rounded"
            />

            {exercises.map((exercise, index) => (
                <div key={index} className="mb-4 p-2 border rounded">

                    <div className="flex gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Exercise name"
                            value={exercise.name}
                            onChange={e => handleExerciseNameChange(index, e.target.value)}
                            className="flex-1 p-1 border rounded"
                        />

                        <input
                            type="number"
                            placeholder="Sets"
                            min="1"
                            max="10"
                            value={exercise.numberOfSets}
                            onChange={e => handleSetCountChange(index, e.target.value)}
                            onBlur={e => {
                                if (e.target.value === "" || parseInt(e.target.value) < 1) {
                                    handleSetCountChange(index, "1");
                                }
                            }}
                            className="w-24 p-1 border rounded"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                        {exercise.sets.map((rep, setIndex) => (
                            <input
                                key={setIndex}
                                type="number"
                                placeholder={`Reps`}
                                min="0"
                                value={rep}
                                onChange={e => handleRepsChange(index, setIndex, e.target.value)}
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
                className="mt-2 mr-2 mb-4 px-4 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 cursor-pointer"
            >
                + Add Exercise
            </button>

            <button
                onClick={handleSaveWorkout}
                className="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 cursor-pointer"
            >
                Save Workout
            </button>

        </div>
    );


}
