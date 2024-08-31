"use client";

import React, { useState } from "react";

interface EventDetails {
  eventName: string;
  eventImage:string;
  organizerName: string;
  organizerEmail: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventSeats : string;
  eventPrice :string;
  eventPubKey :string;
  eventDescription: string;
}

const Page: React.FC = () => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventName: "",
    eventImage:"",
    organizerName: "",
    organizerEmail: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventSeats: "",
    eventPrice: "",
    eventPubKey: "",
    eventDescription: "",

  });

  const [submitted, setSubmitted] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleChange =
    (id: any) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEventDetails({ ...eventDetails, [id]: e.target.value });
      setError(null); // Reset error on input change
      setWarning(null); // Reset warning on input change
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentDate = new Date();
    const enteredDate = new Date(
      `${eventDetails.eventDate}T${eventDetails.eventTime}`
    );

    // Check for errors and warnings
    let hasError = false;
    let hasWarning = false;

    if (enteredDate < currentDate) {
      if (enteredDate.toDateString() === currentDate.toDateString()) {
        // The date is today but the time is in the past
        alert("Error: The event time cannot be in the past.");
        hasError = true;
      } else {
        // The date is before today
        alert("Warning: The event date is before the current date.");
        hasWarning = true;
      }
    }

    // Prevent form submission if there's an error or warning
    if (hasError || hasWarning) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/actions/saveEventData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventDetails),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setEventId(result.eventId);
        setSubmitted(true);
      } else {
        console.error("Failed to send event details");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setEventDetails({
      eventName: "",
      eventImage:"",
      organizerName: "",
      organizerEmail: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      eventSeats: "",
      eventPrice: "",
      eventPubKey: "",
      eventDescription: "",
    });
  };

  const handleCopy = () => {
    if (eventId) {
      navigator.clipboard.writeText(eventId).then(() => {
        alert("Event ID copied to clipboard");
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 mt-10">
      <div className="flex w-full flex-col max-w-2xl">
        {!submitted ? (
          <>
            <div className="flex flex-col flex-1 mr-10 mb-20">
              <h1 className="text-3xl mb-2 text-cyan-200">Create and Share</h1>
              <h1 className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-cyan-500 to-blue-500 mb-4">
                Your Event's Blink
              </h1>
              <p className="text-lg">
                Collect Registrations Directly using BLINKS
              </p>
            </div>

            <form
              className="flex-1 border-2 border-gray-300 p-6 rounded-lg shadow-md"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="mb-4 text-red-600 font-semibold">{error}</div>
              )}
              {warning && (
                <div className="mb-4 text-yellow-600 font-semibold">
                  {warning}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="eventName" className="block font-semibold mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Enter event name"
                  value={eventDetails.eventName}
                  onChange={handleChange("eventName")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventImage"
                  className="block font-semibold mb-2"
                >
                  Event Image Url
                </label>
                <input
                  type="text"
                  id="eventImage"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  onChange={handleChange('eventImage')}
                  placeholder="Enter Image Url"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="eventPubKey"
                  className="block font-semibold mb-2"
                >
                  Wallet Address to Recieve Fees
                </label>
                <input
                  type="text"
                  id="eventPubKey"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  onChange={handleChange('eventPubKey')}
                  placeholder="Enter Wallet Address"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventSeats"
                  className="block font-semibold mb-2"
                >
                  Number of person allowed
                </label>
                <input
                  type="number"
                  id="eventSeats"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Number of person allowed"
                  value={eventDetails.eventSeats}
                  onChange={handleChange("eventSeats")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventPrice"
                  className="block font-semibold mb-2"
                >
                  Ticket Price (if none = 0)
                </label>
                <input
                  type="number"
                  id="eventPrice"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Enter price in SEND token"
                  value={eventDetails.eventPrice}
                  onChange={handleChange("eventPrice")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="organizerName"
                  className="block font-semibold mb-2"
                >
                  Organizer's Name
                </label>
                <input
                  type="text"
                  id="organizerName"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Enter your Name"
                  value={eventDetails.organizerName}
                  onChange={handleChange("organizerName")}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="organizerEmail"
                  className="block font-semibold mb-2"
                >
                  Organizer's Email
                </label>
                <input
                  type="text"
                  id="organizerEmail"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Enter your Email"
                  value={eventDetails.organizerEmail}
                  onChange={handleChange("organizerEmail")}
                />
              </div>
              

              <div className="mb-4">
                <label htmlFor="eventDate" className="block font-semibold mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  value={eventDetails.eventDate}
                  onChange={handleChange("eventDate")}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="eventTime" className="block font-semibold mb-2">
                  Event Time
                </label>
                <input
                  type="time"
                  id="eventTime"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  value={eventDetails.eventTime}
                  onChange={handleChange("eventTime")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventLocation"
                  className="block font-semibold mb-2"
                >
                  Event Location
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Enter the event location"
                  value={eventDetails.eventLocation}
                  onChange={handleChange("eventLocation")}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="eventDescription"
                  className="block font-semibold mb-2"
                >
                  Event Description
                </label>
                <textarea
                  id="eventDescription"
                  className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
                  placeholder="Describe your event"
                  rows={4}
                  value={eventDetails.eventDescription}
                  onChange={handleChange("eventDescription")}
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
              >
                Create Event Blink
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-4 text-green-600">
              Congratulations!
            </h2>
            <p className="text-lg mb-4">
              Your event has been created successfully.
            </p>
            <p className="text-lg mb-4">
              Event ID: <span className="font-semibold">{eventId}</span>
            </p>
            <button
              onClick={handleCopy}
              className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Copy Event ID
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
