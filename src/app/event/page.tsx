'use client';

import React, { useState } from "react";

const Page: React.FC = () => {
  const [eventDetails, setEventDetails] = useState({
    eventName: "",
    organizerEmail: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Event Details:", eventDetails);
    // You can export or use eventDetails here
  };

  return (
    <div className="flex items-center justify-center p-4 mt-10">
      <div className="flex w-full flex-col max-w-2xl">
        {/* Text Content */}
        <div className="flex flex-col flex-1 mr-10 mb-20">
          <h1 className="text-3xl mb-2 text-cyan-200">Create and Share</h1>
          <h1 className="text-6xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-cyan-500 to-blue-500 mb-4">
            Your Event's Blink
          </h1>
          <p className="text-lg">
            Collect Registrations Directly using BLINKS
          </p>
        </div>

        {/* Form */}
        <form
          className="flex-1 border-2 border-gray-300 p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
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
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="organizerEmail"
              className="block font-semibold mb-2"
            >
              Organizer's Email Address
            </label>
            <input
              type="email"
              id="organizerEmail"
              className="w-full p-2 border border-gray-300 rounded placeholder-black text-black"
              placeholder="Enter your email address"
              value={eventDetails.organizerEmail}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
          >
            Create Event Blink
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
