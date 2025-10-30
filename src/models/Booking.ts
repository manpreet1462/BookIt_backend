import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  phone?: string;
}

export interface IBooking extends Document {
  referenceId: string;
  experienceId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  user: IUser;
  promoCode?: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: 'confirmed' | 'cancelled' | 'failed';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  referenceId: { type: String, required: true, unique: true },
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  slotId: { type: Schema.Types.ObjectId, required: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String
  },
  promoCode: String,
  subtotal: Number,
  taxes: Number,
  total: Number,
  status: { type: String, enum: ['confirmed', 'cancelled', 'failed'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
