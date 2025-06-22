import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getUserCompletedWorkouts = async (userId) => {
    const q = query(collection(db, "completedWorkouts"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
