import mongoose, { Schema } from "mongoose";

const eventBlink: Schema = new Schema({
  eventId: { type: String, required: true },
  eventImage: { type: String, required: true },  // Fixed typo here
  eventName: { type: String, required: true },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  eventDateandTime: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventSeats: { type: String, required: true },
  eventfeesType: { type: String, required: true },
  eventPrice: { type: String, required: true },
  eventPubKey: { type: String },  // Ensure consistency with your POST handler
  eventDescription: { type: String, required: true },
});

// Check if the model is already compiled
const EventDataBlink =
  mongoose.models.EventDet || mongoose.model("EventDet", eventBlink);

export default EventDataBlink;
