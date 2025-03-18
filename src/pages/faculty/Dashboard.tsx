import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "./peakpx.jpg";

const FacultyDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requests = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      date: "March 11, 2024",
      time: "2:00 PM",
      description: "Requesting permission to hold Tech Summit 2024.",
      club: "Tech Club",
      event: "Tech Summit 2024",
      phone: "+1 (555) 000-0000",
      contact: "Event Coordinator",
      idCard: Image, 
    },
  ];

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

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
            {requests.map((request) => (
              <Card key={request.id} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Event Permission Request</h4>
                        <p className="text-sm text-muted-foreground">From: {request.name} • {request.club}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">Event</Badge>
                        <Badge variant="outline">{request.date}</Badge>
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        onClick={() => handleViewRequest(request)}
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        View Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      
      {/* Modal for Request Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
<DialogContent className="p-6 rounded-lg shadow-lg bg-gray-900 text-gray-200 border border-gray-700">
  <DialogHeader className="border-b border-gray-700 pb-4">
    <DialogTitle className="text-3xl font-extrabold text-white">
      Request Details
    </DialogTitle>
  </DialogHeader>
  
  {selectedRequest && (
    <div className="space-y-3 mt-4">
      <p className="text-lg"><strong className="text-gray-100">Name:</strong> {selectedRequest.name}</p>
      <p className="text-lg"><strong className="text-gray-100">Email:</strong> {selectedRequest.email}</p>
      <p className="text-lg"><strong className="text-gray-100">Date:</strong> {selectedRequest.date}</p>
      <p className="text-lg"><strong className="text-gray-100">Time:</strong> {selectedRequest.time}</p>
      <p className="text-lg"><strong className="text-gray-100">Event:</strong> {selectedRequest.event}</p>
      <p className="text-lg"><strong className="text-gray-100">Club:</strong> {selectedRequest.club}</p>
      <p className="text-lg"><strong className="text-gray-100">Phone:</strong> {selectedRequest.phone}</p>
      <p className="text-lg"><strong className="text-gray-100">Point of Contact:</strong> {selectedRequest.contact}</p>
      <p className="text-lg"><strong className="text-gray-100">Description:</strong> {selectedRequest.description}</p>
      {selectedRequest.idCard && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-100">ID Card:</p>
          <img
            src={selectedRequest.idCard}
            alt="ID Card"
            className="w-full max-w-xs rounded-lg border border-gray-600 shadow-lg"
          />
        </div>
      )}
    
    </div>
  )}
</DialogContent>


      </Dialog>
    </DashboardLayout>
  );
};

export default FacultyDashboard;