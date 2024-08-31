import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  email: string;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// Explicitly define the collection name as 'registrations'
export default mongoose.models.Registration || mongoose.model<IEvent>('Registration', EventSchema, 'registrations');