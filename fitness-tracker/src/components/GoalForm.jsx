import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext} from "@/AuthContext.jsx";
import { db } from "@/firebase.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function GoalForm() {
    const [goal, setGoal] = useState("cut");
    const [customGoal, setCustomGoal] = useState("");
    const { currentUser } = useContext(AuthContext);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userGoal = goal === "custom" ? customGoal : goal;
        
        try {
            await setDoc(doc(db, "goals", currentUser.uid), {
                goal: userGoal,
                timestamp: new Date(),
            });
            alert("Goal saved!");
        } catch (err) {
            console.error("Error saving goal:", err);
        }
    };
    
    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Set Your Fitness Goal</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <RadioGroup value={goal} onValueChange={setGoal}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cut" id="cut"/>
                            <Label htmlFor="cut">Cut (fat loss)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bulk" id="bulk"/>
                            <Label htmlFor="bulk">Bulk (muscle gain)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="maintain" id="maintain"/>
                            <Label htmlFor="maintain">Maintain</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom"/>
                            <Label htmlFor="custom">Custom</Label>
                        </div>
                    </RadioGroup>

                    {goal === "custom" && (
                        <Input
                            placeholder="Enter your goal"
                            value={customGoal}
                            onChange={(e) => setCustomGoal(e.target.value)}
                            required
                        />
                    )}

                    <Button type="submit" className="w-full cursor-pointer">
                        Save Goal
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}