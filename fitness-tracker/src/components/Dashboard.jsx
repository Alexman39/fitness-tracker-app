import { useEffect, useState, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { AuthContext } from "@/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserProfileForm from "@/components/UserProfileForm";

export default function Dashboard() {
    const { currentUser } = useContext(AuthContext);
    const [goal, setGoal] = useState("");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

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

                if (goalSnap.exists()) {
                    setGoal(goalSnap.data().goal);
                } else {
                    setGoal("No goal set yet.");
                }
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

    // 👇 If profile is missing, show the form
    if (!profile) {
        return <UserProfileForm />;
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Your Current Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-medium text-blue-600">{goal}</p>
                </CardContent>
            </Card>
        </div>
    );
}
