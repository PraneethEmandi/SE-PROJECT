import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPinIcon } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

interface VenueEvent {
  venue_location: string;
  event_name: string;
  club_name: string;
  request_date: string;
  request_time: string;
  request_time_end: string;
}

const VenueBookings = () => {
  const [venues, setVenues] = useState<{ value: string; label: string }[]>([]);
  const [venueEvents, setVenueEvents] = useState<VenueEvent[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>(undefined);

  // Fetch approved venues from API
  const fetchVenues = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/approved-venues");
      const data = await response.json();

      // Extract unique venues
      const uniqueVenues = Array.from(new Set(data.map((event: VenueEvent) => event.venue_location)))
  .map((venue) => ({ value: venue as string, label: venue as string }));


      setVenues(uniqueVenues);
      setVenueEvents(data); // Store all event data
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h1 className="text-2xl font-medium mb-6">Venue Bookings</h1>
        </FadeIn>

        <FadeIn delay="100">
          <div className="mb-8">
            <Select onValueChange={setSelectedVenue} value={selectedVenue}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent>
  {venues.length > 0 ? (
    venues.map((venue) => (
      <SelectItem key={venue.value} value={venue.value}>
        {venue.label}
      </SelectItem>
    ))
  ) : (
    <>
      <SelectItem value="ELHC 203">ELHC 203</SelectItem>
      <SelectItem value="ELHC 401">ELHC 401</SelectItem>
      <SelectItem value="ELHC 402">ELHC 402</SelectItem>
      <SelectItem value="ELHC 403">ELHC 403</SelectItem>
      <SelectItem value="NLHC 101">NLHC 101</SelectItem>
      <SelectItem value="NLHC 102">NLHC 102</SelectItem>
      <SelectItem value="CSED Seminar Hall">CSED Seminar Hall</SelectItem>
    </>
  )}
</SelectContent>

            </Select>
          </div>
        </FadeIn>

        {selectedVenue && (
          <FadeIn delay="200">
            <div className="space-y-4">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-primary" />
                {selectedVenue}
              </h2>

              {venueEvents
                .filter((event) => event.venue_location === selectedVenue)
                .map((event, index) => (
                  <Card key={index} className="border-white/10 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{event.event_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Organized by:</span>
                          <span className="font-medium">{event.club_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{event.request_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">
                            {event.request_time} - {event.request_time_end}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </FadeIn>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VenueBookings;
