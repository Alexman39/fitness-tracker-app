import { useState, useEffect, useContext } from "react";
import { db } from "@/firebase";
import { AuthContext } from "@/AuthContext";
import WorkoutForm from "@/components/WorkoutForm";
import DoWorkout from "@/components/DoWorkout.jsx";
import CompletedWorkouts from "@/components/CompletedWorkouts"; // this is the form UI we previously made
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {Eye, Pencil, Play, X} from 'lucide-react';
import Modal from "@/components/Modal.jsx";

export default function WorkoutPage() {
    const { currentUser } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [completedWorkoutsKey, setCompletedWorkoutsKey] = useState(0);
    const [modalMode, setModalMode] = useState(null); // "view" or "edit"


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

            <Modal
                isOpen={!!modalMode}
                onClose={() => {
                    setSelectedWorkout(null);
                    setModalMode(null);
                }}
            >
                {modalMode === "view" && selectedWorkout && (
                    <>
                        <h2 className="text-xl font-bold mb-4 text-black">{selectedWorkout.name}</h2>
                        <table className="w-full text-left border border-gray-300">
                            <thead className="bg-violet-600">
                            <tr>
                                <th className="p-2 border-b">Exercise</th>
                                <th className="p-2 border-b">Sets</th>
                                <th className="p-2 border-b">Reps</th>
                            </tr>
                            </thead>
                            <tbody className="text-black">
                            {selectedWorkout.exercises.map((ex, idx) => {
                                const repNumbers = ex.sets.map(rep => parseInt(rep, 10));
                                const totalSets = ex.sets.length;
                                const minReps = Math.min(...repNumbers);
                                const maxReps = Math.max(...repNumbers);

                                return (
                                    <tr key={idx} className="odd:bg-white even:bg-gray-100">
                                        <td className="p-2 border-b">{ex.name}</td>
                                        <td className="p-2 border-b">{totalSets}</td>
                                        <td className="p-2 border-b">
                                            {minReps === maxReps ? `${minReps} Reps` : `${minReps}-${maxReps} Reps`}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </>
                )}

                {modalMode === "edit" && selectedWorkout && (
                    <WorkoutForm
                        workoutToEdit={selectedWorkout}
                        mode="edit"
                        onSave={async () => {
                            await fetchWorkouts();
                            setSelectedWorkout(null);
                            setModalMode(null);
                        }}
                        onCancel={() => {
                            setSelectedWorkout(null);
                            setModalMode(null);
                        }}
                    />
                )}

                {modalMode === "do" && selectedWorkout && (
                    <>
                        <DoWorkout
                            workout={selectedWorkout}
                            onFinish={() => {
                                setSelectedWorkout(null);
                                setModalMode(null);
                                setCompletedWorkoutsKey(prev => prev + 1); // refresh completed workouts
                            }}
                            onDiscard={() => {
                                setSelectedWorkout(null);
                                setModalMode(null);
                            }}
                        />
                    </>
                )}

                {modalMode === "create" && (
                    <WorkoutForm
                        workoutToEdit={null}
                        mode="create"
                        onSave={async () => {
                            await fetchWorkouts();
                            setModalMode(null);
                        }}
                        onCancel={() => setModalMode(null)}
                    />
                )}
            </Modal>

            {workouts.length > 0 && (
                <ul className="space-y-4 mt-4 mb-4">
                    {workouts.map(w => (
                        <li key={w.id} className="p-4 border rounded-3xl shadow bg-white text-black">
                            <h2 className="font-semibold">{w.name}</h2>
                            <p className="text-sm text-gray-500">{w.exercises.length} exercises</p>

                            <button
                                onClick={() => {
                                    setSelectedWorkout(w);
                                    setModalMode("view");
                                }}
                                className="mt-2 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                                <Eye/>
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedWorkout(w);
                                    setModalMode("edit");
                                }}
                                className="ml-4 text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                            >
                                <Pencil/>
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedWorkout(w);
                                    setModalMode("do");
                                }}
                                className="ml-4 text-purple-600 hover:text-purple-800 hover:underline cursor-pointer"
                            >
                                <Play />
                            </button>
                            <button
                                onClick={() => handleDeleteWorkout(w.id)}
                                className="ml-4 text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                            >
                                <X/>
                            </button>
                        </li>
                    ))}

                </ul>
            )}

            <div className="text-center mb-6">
                <button
                    onClick={() => {
                        setSelectedWorkout(null);
                        setModalMode("create");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 cursor-pointer"
                >
                    Create Workout
                </button>
            </div>

            {workouts.length === 0 && (
                <div className="text-center mt-6">
                    <p className="text-gray-600 mb-4">You haven't created any workouts yet.</p>
                    <button
                        onClick={() => {
                            setSelectedWorkout(null);
                            setModalMode("create");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 cursor-pointer"
                    >
                        Create Your First Workout
                    </button>
                </div>
            )}

            <CompletedWorkouts refreshKey={completedWorkoutsKey} />

        </div>
    );
}
