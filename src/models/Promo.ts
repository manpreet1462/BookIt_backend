import mongoose, { Document, Schema } from 'mongoose';

export interface IPromo extends Document {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  expiresAt?: Date;
  minAmount?: number;
    createdAt: Date;
}

const PromoSchema = new Schema<IPromo>({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true },
  expiresAt: Date,
  minAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPromo>('Promo', PromoSchema);
