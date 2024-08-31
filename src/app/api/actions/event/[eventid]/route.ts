import {
  ActionGetResponse,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";

import EventDataBlink from "@/app/(mongo)/EventSchema";
import { connectToDatabase } from "@/app/(mongo)/db";

export const GET = async (req: Request) => {
  await connectToDatabase();
  const { pathname } = new URL(req.url);
  const pathSegments = pathname.split("/");
  const eventId = pathSegments[4];

  const eventDetails = await EventDataBlink.findOne({ eventId: eventId });

  if (!eventDetails) {
    return new Response("Event not found", {
      status: 404,
    });
  }

  const payload: ActionGetResponse = {
    icon: `${eventDetails.eventImage}`,
    title: eventDetails.eventName,
    description: `So here are the details of the event
      Organizer : ${eventDetails.organizerName}
      Date and Time : ${eventDetails.eventDate} , ${eventDetails.eventTime} 
      Location : ${eventDetails.eventLocation}
      Number of person allowed : ${eventDetails.eventSeats}
      Ticket price in Sol : ${eventDetails.eventPrice}
      More Info : ${eventDetails.eventDescription}`,
    label: "Join the Event",
    links: {
      actions: [
        {
          label: "Join the event",
          href: `/api/actions/event/${eventId}?name={name}&email={email}`,
          parameters: [
            {
              type: "text",
              name: "name",
              label: "Enter Your Name",
              required: true,
            },
            {
              type: "email",
              name: "email",
              label: "Enter Your Email",
              required: true,
            },
          ],
        },
      ],
    },
    type: "action",
  };

  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;


export const POST = async (req:Request)=>{
   await connectToDatabase();
}