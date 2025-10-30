import mongoose from 'mongoose';
import { Request, Response } from 'express';
import Experience from '../models/Experience';
import Booking from '../models/Booking';

const generateRefId = (): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HD${random}`;
};

export const createBooking = async (req: Request, res: Response) => {
  const { experienceId, slotId, user, promoCode } = req.body;

  if (!experienceId || !slotId || !user?.email || !user?.name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const experience = await Experience.findOne(
      { _id: experienceId, 'slots._id': slotId }
    ).session(session);

    if (!experience) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Experience or slot not found' });
    }

    const slot = (experience.slots as any).id(slotId);
    if (!slot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Slot not found' });
    }

    const existing = await Booking.findOne({
      slotId,
      'user.email': user.email,
      status: { $ne: 'cancelled' }
    }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'You already booked this slot' });
    }

    if (slot.bookedCount >= slot.capacity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'Slot sold out' });
    }

    await Experience.updateOne(
      { _id: experienceId, 'slots._id': slotId },
      { $inc: { 'slots.$.bookedCount': 1 } },
      { session }
    );

    const subtotal = slot.price;
    const taxes = Math.round(subtotal * 0.06); 
    let total = subtotal + taxes;

    if (promoCode && promoCode === 'SAVE10') {
      total = Math.round(total * 0.9);
    }

    const booking = await Booking.create(
      [
        {
          referenceId: generateRefId(),
          experienceId,
          slotId,
          user,
          promoCode,
          subtotal,
          taxes,
          total,
          status: 'confirmed'
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: 'Booking confirmed',
      booking: {
        referenceId: booking[0].referenceId,
        experienceTitle: experience.title,
        date: slot.date,
        time: slot.time,
        total: booking[0].total
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Booking error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
