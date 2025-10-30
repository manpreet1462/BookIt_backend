import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot {
  date: Date;
  time: string;           
  capacity: number;
  bookedCount: number;
  price: number;
}

export interface IExperience extends Document {
  title: string;
  description?: string;
  image?: string;
  location: string;
  price: number;          
  slots: ISlot[];
  createdAt: Date;
}

const SlotSchema = new Schema<ISlot>({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },
  price: { type: Number, required: true }
});

const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  description: String,
  image: String,
  location: String,
  price: Number,
  slots: [SlotSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
