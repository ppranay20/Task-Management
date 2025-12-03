import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ModeToggle } from "../components/mode-toggle";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Dashboard
          </h1>
          <ModeToggle />
        </div>

        {/* Welcome Card */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">
              Welcome, {user?.username}!
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              You're successfully logged in to your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-400">
                ✓ Authentication successful
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                User ID: {user?.id}
              </p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
