import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/AuthContext";
import { getUserCompletedWorkouts } from "@/lib/firebase/completedWorkouts";
import { format } from "date-fns";
import { doc, deleteDoc } from  "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";

export default function CompletedWorkouts({ refreshKey }) {
    const { currentUser } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!currentUser) return;

            try {
                const data = await getUserCompletedWorkouts(currentUser.uid);
                // Sort by most recent
                const sorted = data
                    .sort((a, b) => b.completedAt.toDate() - a.completedAt.toDate())
                    .slice(0, 3); // Only take the top 3
                setLogs(sorted);
            } catch (err) {
                console.error("Error fetching completed workouts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [currentUser, refreshKey]);

    const handleDeleteCompleted = (logId) => {
        toast(
            (t) => (
                <div>
                    <p className="font-semibold mb-2">Delete this workout?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            className="text-gray-500 hover:underline"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </button>
                        <button
                            className="text-red-600 font-semibold hover:underline"
                            onClick={async () => {
                                try {
                                    await deleteDoc(doc(db, "completedWorkouts", logId));
                                    setLogs((prev) => prev.filter((log) => log.id !== logId));
                                    toast.success("Workout deleted.");
                                } catch (err) {
                                    console.error("Failed to delete workout:", err);
                                    toast.error("Something went wrong.");
                                } finally {
                                    toast.dismiss(t.id);
                                }
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 8000,
            }
        );
    };

    if (loading) return <p className="text-center text-gray-500">Loading workout history...</p>;
    if (logs.length === 0) return <p className="text-center text-gray-500">No completed workouts yet.</p>;

    return (
        <div className="max-w-3xl mx-auto p-0">
            <h2 className="text-2xl font-bold mb-6">Workout History</h2>

            <ul className="space-y-6">
                {logs.map((log) => (
                    <li key={log.id} className="p-4 bg-white text-primary border rounded-3xl shadow">
                        <h3 className="text-lg font-semibold">{log.workoutName}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            {format(log.completedAt.toDate(), "PPPpp")}
                        </p>

                        <button
                            onClick={() => handleDeleteCompleted(log.id)}
                            className="text-sm text-red-600 hover:underline mb-2"
                        >
                            Delete Workout
                        </button>

                    </li>
                ))}
            </ul>

            <div className="text-right mt-4">
                <a href="/history" className="text-sm text-blue-600 hover:underline">
                    View All
                </a>
            </div>

        </div>
    );
}
