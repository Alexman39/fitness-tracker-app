import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "@/AuthContext"; // replace with your actual context
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Navbar() {
    const { currentUser } = useContext(AuthContext);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
            {/* Left Side Nav Links */}
            <div className="flex items-center gap-4">
                <Link to="/" className="text-lg font-bold">FitnessApp</Link>
                {currentUser && (
                    <>
                        <Link to="/dashboard" className="text-sm">Dashboard</Link>
                        <Link to="/workout" className="text-sm">Workout</Link>
                    </>
                )}
            </div>

            {/* Right Side Auth Buttons */}
            <div className="flex items-center gap-2">
                {!currentUser ? (
                    <>
                        <Link to="/login">
                            <Button variant="outline" className="cursor-pointer">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="cursor-pointer">Sign Up</Button>
                        </Link>
                    </>
                ) : (
                    <Button onClick={handleLogout} className="cursor-pointer">
                        Logout
                    </Button>
                )}
            </div>
        </nav>
    );
}
