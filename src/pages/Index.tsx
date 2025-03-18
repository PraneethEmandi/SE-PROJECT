
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Student</h2>
          <p className="text-muted-foreground">
            Manage your requests and track their status from your personalized dashboard.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">New Request</h3>
              <PlusCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Create a new permission request</p>
            <Button className="w-full" onClick={() => navigate("/requests/new")}>
                Start Request
            </Button>
          </Card>

          <Card className="p-6 glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Active Requests</h3>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">3</p>
            <Button variant="outline" className="w-full">View All</Button>
          </Card>
        </section>

        {/* Recent Requests */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Requests</h3>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 glass">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Event Permission Request</h4>
                    <p className="text-sm text-muted-foreground">Submitted on March {i}, 2024</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
