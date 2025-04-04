import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";

const NewRequest = () => {
  const { id } = useParams();
  console.log(id);
  const [requestType, setRequestType] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [timeEnd, setTimeEnd] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [clubName, setClubName] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pointOfContact, setPointOfContact] = useState<string>("");
  const [venueLocation, setVenueLocation] = useState<string>("");
  const [idCard, setIdCard] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [idCardName, setIdCardName] = useState<string>("");
  const [requestTo, setRequestTo] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIdCard(event.target.files[0]);
      setIdCardName(event.target.files[0].name);
    }
  };
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/faculty-coordinators"
        );
        const data = await response.json();
        if (response.ok) {
          setFacultyList(data.faculties);
        } else {
          console.error("Error fetching faculty data:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch faculty members:", error);
      }
    };
    fetchFaculty();
  }, []);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    // Confirm submission
    if (!window.confirm("Are you sure you want to submit the request?")) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("requestType", requestType);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("requestDate", date ? format(date, "yyyy-MM-dd") : "");
    formData.append("requestTime", time);
    formData.append("requestTimeEnd", timeEnd);

    formData.append("description", description);
    formData.append("faculty", selectedFaculty || "");
    formData.append("requester_id", id);
    if (idCard) {
      formData.append("idCard", idCard);
    }

    if (requestType === "event" || requestType === "venue") {
      formData.append("clubName", clubName);
      formData.append("eventName", eventName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("pointOfContact", pointOfContact);
    }
    if (requestType === "venue") {
      formData.append("venueLocation", venueLocation);
    }

    try {
      const response = await fetch("http://localhost:5000/api/new-request", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Request submitted successfully!");
        alert(`Success: Request submitted successfully!\n\nDetails:\n- Name: ${fullName}\n- Email: ${email}\n- Date: ${date ? format(date, "PPP") : "Not selected"}\n- Time: ${time || "Not provided"}\n- Type: ${requestType}\n- Faculty: ${selectedFaculty || "Not selected"}`);
        window.location.reload();
      } else {
        setMessage(result.error || "Something went wrong.");
        alert(`Error: ${result.error || "Something went wrong."}`);
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>New Permission Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Label htmlFor="requestType">Request Type</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event Permission</SelectItem>
                  <SelectItem value="venue">Venue Permission</SelectItem>
                </SelectContent>
              </Select>

              {requestType && (
                <div className="space-y-4 animate-fade-in">
                  {/* Common Fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="bg-secondary/50"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="bg-secondary/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-secondary/50",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="time">Start Time</Label>
                      <div className="relative">
                        <Input
                          id="time"
                          type="time"
                          className="bg-secondary/50 pl-10"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />

                        <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      
                    </div> */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="time">Start Time</Label>
                        <div className="relative">
                          <Input
                            id="time"
                            type="time"
                            className="bg-secondary/50 pl-10"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeEnd">End Time</Label>
                        <div className="relative">
                          <Input
                            id="timeEnd"
                            type="time"
                            className="bg-secondary/50 pl-10"
                            value={timeEnd}
                            onChange={(e) => setTimeEnd(e.target.value)}
                          />
                          <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      rows={3}
                      className="w-full rounded-md border border-input bg-secondary/50 p-3 text-sm"
                      placeholder="Provide details about your request..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Event-Specific Fields */}
                  {requestType === "event" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="clubName">Club Name</Label>
                          <Input
                            id="clubName"
                            placeholder="Tech Club"
                            className="bg-secondary/50"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventName">Event Name</Label>
                          <Input
                            id="eventName"
                            placeholder="Tech Summit 2024"
                            className="bg-secondary/50"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="bg-secondary/50"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="poc">Point of Contact</Label>
                          <Input
                            id="poc"
                            placeholder="Event Coordinator"
                            className="bg-secondary/50"
                            value={pointOfContact}
                            onChange={(e) => setPointOfContact(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Venue-Specific Fields */}
                  {requestType === "venue" && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="clubName">Club Name</Label>
                          <Input
                            id="clubName"
                            placeholder="Tech Club"
                            className="bg-secondary/50"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventName">Event Name</Label>
                          <Input
                            id="eventName"
                            placeholder="Tech Summit 2024"
                            className="bg-secondary/50"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="bg-secondary/50"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="poc">Point of Contact</Label>
                          <Input
                            id="poc"
                            placeholder="Event Coordinator"
                            className="bg-secondary/50"
                            value={pointOfContact}
                            onChange={(e) => setPointOfContact(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venueLocation">Venue Location</Label>
                        <Select
                          value={venueLocation}
                          onValueChange={setVenueLocation}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select venue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ELHC 203">ELHC 203</SelectItem>
                            <SelectItem value="ELHC 401">ELHC 401</SelectItem>
                            <SelectItem value="ELHC 402">ELHC 402</SelectItem>
                            <SelectItem value="ELHC 403">ELHC 403</SelectItem>
                            <SelectItem value="NLHC 101">NLHC 101</SelectItem>
                            <SelectItem value="NLHC 102">NLHC 102</SelectItem>
                            <SelectItem value="CSED Seminar Hall">
                              CSED Seminar Hall
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idCard">ID Card Upload</Label>

                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 bg-secondary/30 border-border">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, PNG, JPG (MAX. 2MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            name="idCard"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>

                      {/* Display selected file with checkmark */}
                      {idCard && (
                        <div className="flex items-center mt-2 p-2 rounded-lg bg-secondary/30 border border-border text-foreground shadow-sm">
                          <span className="mr-2 text-green-500">✔</span>
                          <span className="truncate">{idCardName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Label>Select Faculty</Label>
                  <Select onValueChange={setSelectedFaculty}>
                    <SelectTrigger className="w-full">
                      {selectedFaculty
                        ? facultyList.find(
                          (f) => f.id.toString() === selectedFaculty
                        )?.name || "Select Faculty"
                        : "Select Faculty"}
                    </SelectTrigger>
                    <SelectContent>
                      {facultyList.map((faculty) => (
                        <SelectItem
                          key={faculty.id}
                          value={faculty.id.toString()}
                        >
                          {`${faculty.name} - ${faculty.club_name || "No Club"
                            }`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Submit Button */}
                  <Button className="w-full" type="submit">
                    Submit Request
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default NewRequest;
