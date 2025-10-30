import { Request, Response } from 'express';
import Promo from '../models/Promo';

export const validatePromo = async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  if (!code || !amount) return res.status(400).json({ message: 'Code and amount are required' });

  const promo = await Promo.findOne({ code: code.toUpperCase() });
  if (!promo) return res.status(404).json({ valid: false, message: 'Invalid promo code' });

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return res.status(400).json({ valid: false, message: 'Promo expired' });
  }

  if (promo.minAmount && amount < promo.minAmount) {
    return res.status(400).json({
      valid: false,
      message: `Minimum amount ₹${promo.minAmount} required`
    });
  }

  let discount = 0;
  if (promo.type === 'percent') discount = Math.round((amount * promo.value) / 100);
  else discount = promo.value;

  const finalTotal = Math.max(amount - discount, 0);

  return res.json({
    valid: true,
    code: promo.code,
    discount,
    finalTotal
  });
};
