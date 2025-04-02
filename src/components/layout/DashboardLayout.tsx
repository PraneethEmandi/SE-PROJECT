import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    // fetch("http://localhost:5000/api/logout",{
    //   method: "POST",
    //   headers: {
    //     Authorization: localStorage.getItem("token"),
    //   },
    // })
    navigate("/");
  }
  return (
    <div className="min-h-screen dark-gradient flex flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full glass border-border/40 shadow-lg">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl ml-8 font-bold text-foreground">Requirements Portal</h1>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
              <Bell className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-secondary" onClick = {handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20 px-8">
        <div className="max-w-7.5xl mx-auto py-10 animate-fade-in bg-transparent shadow-lg rounded-xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;