
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
  const [requestType, setRequestType] = useState<string>("");
  const [date, setDate] = useState<Date>();
  
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
                {/* Common Fields */}
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
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Input 
                        id="time" 
                        type="time" 
                        className="bg-secondary/50 pl-10" 
                      />
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                  />
                </div>

                {/* Conditional Fields */}
                {requestType === "event" && (
                  <div className="space-y-4 animate-fade-in">
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
                  </div>
                )}

                {requestType === "venue" && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="place">Venue Location</Label>
                    <Input id="place" placeholder="Main Auditorium" className="bg-secondary/50" />
                  </div>
                )}

                {/* File Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>ID Card Upload</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 bg-secondary/30 border-border">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 2MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button className="w-full">
                  Submit Request
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;
