
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full glass border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-semibold">Requirements Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform glass border-r transition-transform duration-200 ease-in-out",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <nav className="space-y-2 p-4">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            New Request
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            My Requests
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Settings
          </Button>
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
