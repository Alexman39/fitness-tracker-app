import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/AuthContext";
import { getUserCompletedWorkouts } from "@/lib/firebase/completedWorkouts";
import { format } from "date-fns";

export default function CompletedWorkouts() {
    const { currentUser } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!currentUser) return;

            try {
                const data = await getUserCompletedWorkouts(currentUser.uid);
                // Sort by most recent
                const sorted = data.sort(
                    (a, b) => b.completedAt.toDate() - a.completedAt.toDate()
                );
                setLogs(sorted);
            } catch (err) {
                console.error("Error fetching completed workouts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [currentUser]);

    if (loading) return <p className="text-center text-gray-500">Loading workout history...</p>;
    if (logs.length === 0) return <p className="text-center text-gray-500">No completed workouts yet.</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Workout History</h2>

            <ul className="space-y-6">
                {logs.map((log) => (
                    <li key={log.id} className="p-4 bg-white border rounded shadow">
                        <h3 className="text-lg font-semibold">{log.workoutName}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            {format(log.completedAt.toDate(), "PPPpp")}
                        </p>

                        {log.completedExercises.map((ex, idx) => (
                            <div key={idx} className="mb-2">
                                <p className="font-medium">{ex.name}</p>
                                <ul className="ml-4 list-disc text-sm">
                                    {ex.planned.map((plannedRep, setIdx) => (
                                        <li key={setIdx}>
                                            Set {setIdx + 1}: {ex.actual[setIdx]} reps (planned {plannedRep})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}
