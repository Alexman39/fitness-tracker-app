import { useEffect, useState, useContext } from "react";
import { doc,setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { AuthContext } from "@/AuthContext";
import UserProfileForm from "@/components/UserProfileForm";
import { getTodayWorkout } from "@/utils/workoutSplit.js";
import {logWorkoutCompletion} from "@/utils/workoutLogger.js";

export default function Dashboard() {
    const { currentUser } = useContext(AuthContext);
    const [goal, setGoal] = useState("");
    const [profile, setProfile] = useState(null);
    const [planInfo, setPlanInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [workoutDone, setWorkoutDone] = useState(false);
    const [workoutExercises, setWorkoutExercises] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;

            try {
                // Fetch profile
                const profileRef = doc(db, "profiles", currentUser.uid);
                const profileSnap = await getDoc(profileRef);
                if (profileSnap.exists()) {
                    setProfile(profileSnap.data());
                } else {
                    setProfile(null);
                    setLoading(false);
                    return;
                }

                // Fetch goal
                const goalRef = doc(db, "goals", currentUser.uid);
                const goalSnap = await getDoc(goalRef);
                setGoal(goalSnap.exists() ? goalSnap.data().goal : "No goal set yet.");

                // Fetch plan
                const planRef = doc(db, "plans", currentUser.uid);
                const planSnap = await getDoc(planRef);

                if (planSnap.exists()) {
                    const planData = planSnap.data();
                    setPlanInfo(planData);

                    const todaySplit = getTodayWorkout(
                        planData.planStartDate,
                        planData.trainingFrequency
                    );

                    console.log("Today's split is:", todaySplit);

                    const workoutRef = doc(db, "workoutTemplates", todaySplit);
                    const workoutSnap = await getDoc(workoutRef);

                    if (workoutSnap.exists()) {
                        const exercises = workoutSnap.data().exercises;
                        console.log("Workout exercises fetched:", exercises);
                        setWorkoutExercises(exercises || []);
                    } else {
                        console.warn("No workout template found for:", todaySplit);
                    }
                }

                const handleWorkoutComplete = async () => {
                    if (!currentUser || !planInfo) return;
``
                    const today = new Date().toISOString().slice(0, 10);
                    const logId = `${currentUser.uid}_${today}`;
                    const logRef = doc(db, "workoutLogs", logId);

                    try {
                        await setDoc(logRef, {
                            userId: currentUser.uid,
                            date: today,
                            split: getTodayWorkout(planInfo.planStartDate, planInfo.trainingFrequency),
                            status: "completed"
                        });
                        setWorkoutDone(true);
                    } catch (err) {
                        console.error("Error saving workout log:", err);
                    }
                };


            } catch (err) {
                console.error("Error fetching user data:", err);
                setGoal("Error loading data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);


    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Loading...</p>;
    }

    if (!profile) {
        return <UserProfileForm />;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">

            <p>Today's Workout Plan</p>

            {planInfo ? (
                <>
                    <p className="text-green-700 font-semibold">
                        {getTodayWorkout(planInfo.planStartDate, planInfo.trainingFrequency)}
                    </p>

                    {!workoutDone && (
                        <button
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={async () => {
                                const workoutName = getTodayWorkout(planInfo.planStartDate, planInfo.trainingFrequency);
                                await logWorkoutCompletion(currentUser.uid, workoutName);
                                setWorkoutDone(true);
                            }}
                        >
                            Mark Workout as Done
                        </button>
                    )}

                    {workoutDone && <p className="mt-4 text-green-500">✅ Workout Completed</p>}

                    {workoutExercises.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-md font-semibold mb-2">Exercises:</h3>
                            <ul className="list-disc pl-6 space-y-1">
                                {workoutExercises.map((exercise, index) => (
                                    <li key={index}>
                                        {exercise.name} — {exercise.sets} sets x {exercise.reps} reps
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </>
            ) : (
                <p className="text-gray-500">No plan found.</p>
            )}


        </div>
    );

}

