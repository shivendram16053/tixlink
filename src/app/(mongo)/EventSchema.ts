import mongoose, { Schema } from "mongoose";

const eventBlink: Schema = new Schema({
  eventId: { type: String, required: true },
  eventImage: { type: String, require: true },
  eventName: { type: String, required: true },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventSeats: { type: String, required: true },
  eventPrice: { type: String, required: true },
  eventDescription: { type: String, required: true },
});

// Check if the model is already compiled
const EventDataBlink =
  mongoose.models.Event || mongoose.model("Event", eventBlink);

export default EventDataBlink;
