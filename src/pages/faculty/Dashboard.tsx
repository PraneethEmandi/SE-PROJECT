import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { permission } from "process";

const FacultyDashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [nextApprovers, setNextApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState(null);
  const [facultyHierarchy, setFacultyHierarchy] = useState(null);

  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [hasNextApprovers, setHasNextApprovers] = useState(true); // Default to true

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // const facultyId = localStorage.getItem("faculty_id"); // Store faculty ID in localStorage when logging in
        console.log("Token:", token);
        // console.log(facultyId)
        // console.log("Faculty ID:", facultyId);
        // console.log(faculty)
        if (!token) {
          console.error("Missing authentication details");
          return;
        }
        // Fetch faculty hierarchy
        const hierarchyResponse = await fetch(
          "http://localhost:5000/api/current-hierarchy",
          { headers: { Authorization: token } }
        );
        const hierarchyData = await hierarchyResponse.json();
        setFacultyHierarchy(hierarchyData.hierarchy);
        // Fetch counts
        const countsResponse = await fetch(
          "http://localhost:5000/api/faculty-approvals",
          { headers: { Authorization: token } }
        );
        const countsData = await countsResponse.json();
        setCounts(countsData);

        // Fetch pending requests
        const requestsResponse = await fetch(
          "http://localhost:5000/api/faculty-requests",
          { headers: { Authorization: token } }
        );
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
        console.log("kaja ", requestsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const fetchNextApprovers = async (requestType, hierarchy) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Fetching Next Approvers...");
      console.log("Request Type:", requestType);
      console.log("Current Hierarchy:", hierarchy);

      const response = await fetch(
        `http://localhost:5000/api/next-approvers?type=${requestType}&hierarchy=${hierarchy}`,
        { headers: { Authorization: token } }
      );

      if (!response.ok) throw new Error("Failed to fetch next approvers");

      const data = await response.json();
      console.log("Next Approvers:", data);

      setNextApprovers(data);
      setHasNextApprovers(data.length > 0); // Update hasNextApprovers based on response

      return data;
    } catch (error) {
      console.error("Error fetching next approvers:", error);
      setHasNextApprovers(false); // No next approvers available
      return [];
    }
  };

  useEffect(() => {
    if (selectedRequest && facultyHierarchy !== undefined) {
      console.log("Selected Request Changed:", selectedRequest);

      const fetchApprovers = async () => {
        const approvers = await fetchNextApprovers(
          selectedRequest.permission,
          facultyHierarchy
        );
        setNextApprovers(approvers);
        setHasNextApprovers(approvers.length > 0); // Ensure consistency
      };

      fetchApprovers();
    }
  }, [selectedRequest, facultyHierarchy]);

  const handleViewRequest = async (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);

    const approvers = await fetchNextApprovers(
      request.permission,
      facultyHierarchy
    );
    console.log("Approvers: ", approvers);
    setNextApprovers(approvers);
    setSelectedApprover(""); // Reset selected approver
  };

  const handleApprove = async (request) => {
    if (!selectedApprover && hasNextApprovers) {
      alert("Please select the next approver.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Fetch the current user's hierarchy
      const hierarchyResponse = await fetch(
        "http://localhost:5000/api/current-hierarchy",
        { headers: { Authorization: token } }
      );

      if (!hierarchyResponse.ok) {
        alert("Failed to fetch hierarchy. Please try again.");
        return;
      }

      const hierarchyData = await hierarchyResponse.json();
      const currentHierarchy = hierarchyData.hierarchy; // Extract hierarchy
      console.log("request ", request);
      // Send the appr  oval request
      const response = await fetch(
        "http://localhost:5000/api/approve-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            request_id: request.request_id,
            approver_id: hasNextApprovers ? selectedApprover : null, // Pass only if needed
          }),
        }
      );

      if (response.ok) {
        alert(
          hasNextApprovers
            ? "Request approved and forwarded!"
            : "Request fully approved!"
        );
        setRequests(requests.filter((r) => r.id !== request.request_id));
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to approve request: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const denyRequest = async (requestId) => {
    const comments = prompt("Enter a reason for denial (optional):") || ""; // Prompt for comments
    console.log("Request ID:", requestId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/deny-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          request_id: requestId,
          comments: comments,
        }),
      });

      if (response.ok) {
        alert("Request denied successfully.");
        setRequests(requests.filter((r) => r.id !== requestId)); // Remove from UI
        window.location.reload(); // Reload the page
      } else {
        alert("Failed to deny request.");
      }
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };
  const getImageUrl = (path) => {
    console.log(path);
    console.log(window.location.href);
    console.log(window.location.pathname);

    return `../../backend/${path}`; // Replace with actual base URL
  };

  // const handleImageError = (event) => {
  //   console.log("HI");
  //   event.target.src = "/placeholder-image.jpg"; // Provide a fallback image
  // };
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome ! 
          </h2>
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
              <p className="text-2xl font-bold">{counts.pending}</p>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Approved</h3>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold">{counts.approved}</p>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Denied</h3>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold">{counts.rejected}</p>
            </div>
          </Card>
        </section>

        {/* Pending Requests */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Pending Requests</h3>

          {requests.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            <div className="grid gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <h4 className="font-semibold">{request.event}</h4>
                        <p className="text-sm text-muted-foreground">
                          From: {request.name} • {request.club}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">Event</Badge>
                          <Badge variant="outline">{request.date}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* {hasNextApprovers && (
                          <select
                            className="border p-2 rounded"
                            onChange={(e) =>
                              setSelectedApprover(e.target.value)
                            }
                            value={selectedApprover || ""}
                          >
                            <option value="">Select Next Approver</option>
                            {nextApprovers.map((approver) => (
                              <option key={approver.id} value={approver.id}>
                                {approver.name} ({approver.role_name})
                              </option>
                            ))}
                          </select>
                        )} */}

                        {/** View Request Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-500 "
                          onClick={() => handleViewRequest(request)}
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          View Request
                        </Button>

                        {/** Show Approve & Deny Buttons Only If a Request is Selected */}
                        {selectedRequest?.request_id === request.request_id && (
                          <div className="flex gap-2">
                            {nextApprovers.length > 0 && (
                              <select
                                className="border p-2 rounded bg-black text-white"
                                onChange={(e) =>
                                  setSelectedApprover(e.target.value)
                                }
                                value={selectedApprover || ""}
                              >
                                <option value="">Select Next Approver</option>
                                {nextApprovers.map((approver) => (
                                  <option key={approver.id} value={approver.id}>
                                    {approver.name} ({approver.role_name})
                                  </option>
                                ))}
                              </select>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-500 text-emerald-500 "
                              onClick={() => handleApprove(request)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {hasNextApprovers
                                ? "Approve & Forward"
                                : "Approve"}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 "
                              onClick={() => denyRequest(request.request_id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Deny
                            </Button>
                          </div>
                        )}

                        {/* <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                          onClick={() => handleApprove(request)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          {hasNextApprovers ? "Approve & Forward" : "Approve"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => denyRequest(request.request_id)}
                        >
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
                        </Button> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
              <p className="text-lg">
                <strong className="text-gray-100">Name:</strong>{" "}
                {selectedRequest.name}
              </p>
              <p className="text-lg">
                <strong className="text-gray-100">Email:</strong>{" "}
                {selectedRequest.email}
              </p>
              <p className="text-lg">
                <strong className="text-gray-100">Date:</strong>{" "}
                {selectedRequest.date}
              </p>
              <p className="text-lg">
                <strong className="text-gray-100">Event:</strong>{" "}
                {selectedRequest.event}
              </p>
              <p className="text-lg">
                <strong className="text-gray-100">Club:</strong>{" "}
                {selectedRequest.club}
              </p>
              <p className="text-lg">
                <strong className="text-gray-100">Phone:</strong>{" "}
                {selectedRequest.phone}
              </p>
              <p className="text-lg">
                <strong className="text-gray-100">Description:</strong>{" "}
                {selectedRequest.description}
              </p>
              {selectedRequest.id_card && (
                <div className="mt-4">
                  <strong className="text-gray-100">ID Card:</strong>
                  <div className="mt-2 border p-2">
                    <img
                      src={getImageUrl(selectedRequest.id_card)}
                      alt="ID Card"
                      className="w-full max-w-xs rounded"
                      onError={(e) => handleImageError(e)}
                    />
                  </div>
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
