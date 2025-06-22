import { useState, useEffect, useContext } from "react";
import { db } from "@/firebase";
import { AuthContext } from "@/AuthContext";
import WorkoutForm from "@/components/WorkoutForm";
import DoWorkout from "@/components/DoWorkout.jsx";
import CompletedWorkouts from "@/components/CompletedWorkouts"; // this is the form UI we previously made
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function WorkoutPage() {
    const { currentUser } = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [workoutToDo, setWorkoutToDo] = useState(null);
    const [completedWorkoutsKey, setCompletedWorkoutsKey] = useState(0);

    const fetchWorkouts = async () => {
        if (!currentUser) return;

        const snapshot = await getDocs(collection(db, "customWorkouts"));
        const userWorkouts = snapshot.docs
            .filter(doc => doc.data().userId === currentUser.uid)
            .map(doc => ({ id: doc.id, ...doc.data() }));

        setWorkouts(userWorkouts);
    };

    useEffect(() => {
        fetchWorkouts();
    }, [currentUser]);

    const handleDeleteWorkout = async (workoutId) => {
        if (!confirm("Are you sure you want to delete this workout?")) return;

        try {
            await deleteDoc(doc(db, "customWorkouts", workoutId));
            await fetchWorkouts(); // refresh the list
        } catch (err) {
            console.error("Failed to delete workout:", err);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Workouts</h1>

            {selectedWorkout && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-xl font-bold mb-2">{selectedWorkout.name}</h2>

                    {selectedWorkout.exercises.map((ex, idx) => (
                        <div key={idx} className="mb-4">
                            <h3 className="font-semibold">{ex.name}</h3>
                            <ul className="ml-4 list-disc text-sm text-gray-700">
                                {ex.sets.map((rep, i) => (
                                    <li key={i}>Set {i + 1}: {rep} reps</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <button
                        onClick={() => setSelectedWorkout(null)}
                        className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            )}

            {workouts.length === 0 && !showForm && (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">You haven't created any workouts yet.</p>
                </div>
            )}

            {workouts.length > 0 && (
                <ul className="space-y-4 mt-4 mb-4">
                    {workouts.map(w => (
                        <li key={w.id} className="p-4 border rounded shadow">
                            <h2 className="font-semibold">{w.name}</h2>
                            <p className="text-sm text-gray-500">{w.exercises.length} exercises</p>

                            <button
                                onClick={() => setSelectedWorkout(w)}
                                className="mt-2 text-blue-600 hover:underline"
                            >
                                View
                            </button>
                            <button
                                onClick={() => {
                                    setEditingWorkout(w);
                                    setShowForm(true);
                            }}
                                className="ml-4 text-green-600 hover:underline"
                            >
                            Edit Workout
                            </button>
                            <button
                                onClick={() => setWorkoutToDo(w)}
                                className="ml-4 text-purple-600 hover:underline"
                            >
                                Do Workout
                            </button>
                            <button
                                onClick={() => handleDeleteWorkout(w.id)}
                                className="ml-4 text-red-600 hover:underline"
                            >
                                Delete Workout
                            </button>
                        </li>
                    ))}

                </ul>
            )}

            {!showForm && (
                <div className="text-center mb-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Create Workout
                    </button>
                </div>
            )}

            {workoutToDo && (
                <DoWorkout
                    workout={workoutToDo}
                    onFinish={() => {
                        setWorkoutToDo(null);
                        setCompletedWorkoutsKey(prev => prev + 1); // trigger refresh
                    }}
                    onDiscard={() => setWorkoutToDo(null)}
                />
            )}


            {showForm && (
                <div className="mt-6">
                    <WorkoutForm
                        workoutToEdit={editingWorkout}
                        onSave={async () => {
                            await fetchWorkouts();
                            setShowForm(false);
                            setEditingWorkout(null); // clear after save
                        }}
                    />
                </div>
            )}

            <CompletedWorkouts refreshKey={completedWorkoutsKey} />

        </div>
    );
}
