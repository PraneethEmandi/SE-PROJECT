
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";

const FacultyDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Dr. Smith</h2>
          <p className="text-muted-foreground">
            Review and manage student requests from your personalized dashboard.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 glass">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Pending Review</h3>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold">8</p>
              <Button variant="outline" className="w-full">View All</Button>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Approved</h3>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold">12</p>
              <Button variant="outline" className="w-full">View History</Button>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Needs Info</h3>
                <HelpCircle className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">3</p>
              <Button variant="outline" className="w-full">Review</Button>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Denied</h3>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold">2</p>
              <Button variant="outline" className="w-full">View History</Button>
            </div>
          </Card>
        </section>

        {/* Pending Requests */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Pending Requests</h3>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Event Permission Request</h4>
                        <p className="text-sm text-muted-foreground">From: John Doe • CS Department</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">Event</Badge>
                        <Badge variant="outline">March {i+10}, 2024</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                        <XCircle className="mr-2 h-4 w-4" />
                        Deny
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Request Info
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
