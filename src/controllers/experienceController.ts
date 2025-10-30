import { Request, Response } from 'express';
import Experience from '../models/Experience';

export const getAll = async (_req: Request, res: Response) => {
  const experiences = await Experience.find().select('-__v');
  res.json(experiences);
};

export const getById = async (req: Request, res: Response) => {
  const exp = await Experience.findById(req.params.id);
  if (!exp) return res.status(404).json({ message: 'Experience not found' });
  res.json(exp);
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const { title, description, image, location, price, slots } = req.body;

    if (!title || !location || !price || !slots || !Array.isArray(slots)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const newExperience = await Experience.create({
      title,
      description,
      image,
      location,
      price,
      slots,
    });

    res.status(201).json(newExperience);
  } catch (error) {
    console.error("Error creating experience:", error);
    res.status(500).json({ message: "Failed to create experience" });
  }
};