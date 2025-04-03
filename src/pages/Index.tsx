import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Approval {
  status: string;
  approver_name: string;
  role_name: string;
}

interface Request {
  id: number;
  request_type: string;
  request_date: string;
  status: string;
  approvals?: Approval[]; 
}

const Index = () => {
  const { id } = useParams();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log("Fetching requests for ID:", id);
        const response = await fetch(`http://localhost:5000/api/requests/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const requestsData = await response.json();
        console.log("Requests data:", requestsData);

        // Fetch approvals for each request
        const requestsWithApprovals = await Promise.all(
          requestsData.map(async (request: Request) => {
            const approvalsResponse = await fetch(`http://localhost:5000/api/approvals/${request.id}`);
            const approvalsData = await approvalsResponse.json();
            return { ...request, approvals: approvalsData };
          })
        );

        setRequests(requestsWithApprovals);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (id) fetchRequests();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, Student</h2>
          <p className="text-muted-foreground">
            Manage your requests and track their status from your personalized dashboard.
          </p>
        </section>

        {/* Cards for Quick Actions */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 glass space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">New Request</h3>
              <PlusCircle className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Create a new permission request</p>
            <Link to={`/requests/new/${id}`}>
              <Button variant="outline" className="w-full">Start Request</Button>
            </Link>
          </Card>

          <Card className="p-6 glass space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Booked Venues</h3>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Check booked venues</p>
            <Link to="/venues">
              <Button variant="outline" className="w-full">View Venues</Button>
            </Link>
          </Card>

          <Card className="p-6 glass space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Active Requests</h3>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{requests.length}</p>
            {/* <Button variant="outline" className="w-full">View All</Button> */}
          </Card>
        </section>

        {/* Recent Requests */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Requests</h3>
          <div className="grid gap-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <Card key={request.id} className="p-4 glass space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{request.request_type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(request.request_date).toLocaleDateString()}
                      </p>
                      <p className={`text-sm font-semibold ${
                        request.status === "approved" ? "text-green-500" : 
                        request.status === "Rejected" ? "text-red-500" :
                        "text-yellow-500"
                      }`}>
                        {request.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>

                  {/* Approvals Section */}
                  {request.approvals && request.approvals.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold">Approvals:</h5>
                      <ul className="list-none space-y-1">
                        {request.approvals.map((approval, index) => (
                          <li key={index} className="text-sm">
                            <span className={`font-semibold ${
                              approval.status === "Approved" ? "text-green-500" :
                              approval.status === "Rejected" ? "text-red-500" :
                              "text-yellow-500"
                            }`}>
                              {approval.status}
                            </span> - {approval.approver_name} ({approval.role_name})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No recent requests found.</p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
