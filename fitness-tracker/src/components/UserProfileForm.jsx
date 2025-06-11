import { useState, useContext } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { AuthContext } from "@/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAndSavePlan} from "@/utils/generatePlan.js";

export default function UserProfileForm() {
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        gender: "male",
        age: "",
        height: "",
        weight: "",
        bodyFat: "",
        goal: "cut",
        activityLevel: "moderate",
        goalDuration: "",       // weeks/months
        targetWeight: "",       // kg
        trainingFrequency: "",  // days per week
        experienceLevel: "beginner" // beginner/intermediate/advanced
    });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target?.value ?? e });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, "profiles", currentUser.uid), {
                ...formData,
                createdAt: new Date(),
            });

            await generateAndSavePlan(formData, currentUser.uid);

            alert("Profile saved successfully!");
        } catch (err) {
            console.error("Error saving profile:", err);
        }
    };

    return (
        <Card className="max-w-lg mx-auto mt-10">
            <CardHeader>
                <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup value={formData.gender} onValueChange={handleChange("gender")}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Female</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" value={formData.age} onChange={handleChange("age")} />
                        </div>
                        <div>
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" type="number" value={formData.height} onChange={handleChange("height")} />
                        </div>
                        <div>
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" type="number" value={formData.weight} onChange={handleChange("weight")} />
                        </div>
                        <div>
                            <Label htmlFor="bodyFat">Body Fat %</Label>
                            <Input id="bodyFat" type="number" value={formData.bodyFat} onChange={handleChange("bodyFat")} />
                        </div>
                    </div>

                    <div>
                        <Label>Goal</Label>
                        <Select value={formData.goal} onValueChange={handleChange("goal")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cut">Cut</SelectItem>
                                <SelectItem value="bulk">Bulk</SelectItem>
                                <SelectItem value="maintain">Maintain</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Activity Level</Label>
                        <Select value={formData.activityLevel} onValueChange={handleChange("activityLevel")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="light">Light (1–2x/week)</SelectItem>
                                <SelectItem value="moderate">Moderate (3–4x/week)</SelectItem>
                                <SelectItem value="active">Active (5–6x/week)</SelectItem>
                                <SelectItem value="very_active">Very Active (daily)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="goalDuration">Goal Time Frame (weeks)</Label>
                        <Input id="goalDuration" type="number" value={formData.goalDuration} onChange={handleChange("goalDuration")} />
                    </div>

                    <div>
                        <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                        <Input id="targetWeight" type="number" value={formData.targetWeight} onChange={handleChange("targetWeight")} />
                    </div>

                    <div>
                        <Label htmlFor="trainingFrequency">Training Days per Week</Label>
                        <Input id="trainingFrequency" type="number" value={formData.trainingFrequency} onChange={handleChange("trainingFrequency")} />
                    </div>

                    <div>
                        <Label>Experience Level</Label>
                        <Select value={formData.experienceLevel} onValueChange={handleChange("experienceLevel")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    <Button type="submit" className="w-full">Save Info</Button>
                </form>
            </CardContent>
        </Card>
    );
}
