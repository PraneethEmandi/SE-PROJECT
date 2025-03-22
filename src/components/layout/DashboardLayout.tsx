
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
    // const navigate = useNavigate();
  return (
    <div className="min-h-screen dark-gradient">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full glass border-border/40">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground hover:bg-secondary"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Requirements Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-secondary">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform glass border-r border-border/40 transition-transform duration-200 ease-in-out",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <nav className="space-y-2 p-4">
          <Link to="/student/dashboard/:id"><Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
            Dashboard
          </Button></Link>
          <Link to="/requests/new"><Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
            New Request
          </Button></Link>
          {/* <Link to=""><Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
            My Requests
          </Button></Link>
          <Link to=""><Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary">
            Settings
          </Button></Link> */}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] transition-all duration-200 ease-in-out",
          sidebarOpen ? "ml-64" : "ml-0",
          "pt-16 px-4"
        )}
      >
        <div className="container mx-auto py-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
