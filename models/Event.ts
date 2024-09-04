import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  email: string;
  phone: string;
  affiliation?: string; 
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  affiliation: { type: String, required: false },
});

export default mongoose.models.Registration || mongoose.model<IEvent>('Registration', EventSchema, 'registrations');