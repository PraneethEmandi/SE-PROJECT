import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";

const NewRequest = () => {
  const [requestType, setRequestType] = useState("");
  const [date, setDate] = useState();
  const [venue, setVenue] = useState("");
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>New Permission Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
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
            </div>

            {requestType && (
              <form className="space-y-4 animate-fade-in">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-secondary/50" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-secondary/50", !date && "text-muted-foreground")}> 
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(selectedDate) => setDate(selectedDate || date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Input id="time" type="time" className="bg-secondary/50 pl-10" />
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clubName">Club Name</Label>
                    <Input id="clubName" placeholder="Tech Club" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input id="eventName" placeholder="Tech Summit 2024" className="bg-secondary/50" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poc">Point of Contact</Label>
                    <Input id="poc" placeholder="Event Coordinator" className="bg-secondary/50" />
                  </div>
                </div>

                {requestType === "venue" && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="venue">Venue Location</Label>
                    <Select value={venue} onValueChange={setVenue}>
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
                        <SelectItem value="CSED Seminar Hall">CSED Seminar Hall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button className="w-full">Submit Request</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;
