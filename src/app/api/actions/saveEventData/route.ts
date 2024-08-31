import EventDataBlink from "../../../(mongo)/EventSchema";
import { connectToDatabase } from "@/app/(mongo)/db";
import { customAlphabet } from "nanoid";

// Define a type for your event details
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

// Handle POST requests
export const POST = async (req: Request) => {
  try {
    await connectToDatabase();

    const eventDetails: EventDetails = await req.json();

    // Basic validation
    if (
      !eventDetails.eventName ||
      !eventDetails.eventImage ||
      !eventDetails.organizerName ||
      !eventDetails.organizerEmail ||
      !eventDetails.eventSeats ||
      !eventDetails.eventPrice ||
      !eventDetails.eventDate ||
      !eventDetails.eventTime ||
      !eventDetails.eventLocation ||
      !eventDetails.eventPubKey ||
      !eventDetails.eventDescription
    ) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const generateRandomId = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 12);
    const randomId = generateRandomId();

    const newEvent = new EventDataBlink({
      eventId: randomId,
      eventName: eventDetails.eventName,
      eventImage: eventDetails.eventImage,
      organizerName: eventDetails.organizerName,
      organizerEmail: eventDetails.organizerEmail,
      eventDate: eventDetails.eventDate,
      eventTime: eventDetails.eventTime,
      eventLocation: eventDetails.eventLocation,
      eventSeats: eventDetails.eventSeats,
      eventPrice: eventDetails.eventPrice,
      eventPubKey: eventDetails.eventPubKey,
      eventDescription: eventDetails.eventDescription,
    });

    await newEvent.save();

    return new Response(JSON.stringify({ eventId: randomId }), { status: 200 });
  } catch (error) {
    console.error("Error handling event details:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
