import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import connectDB from "./config/db";
import cors from "cors";

import experienceRoutes from "./routes/experienceRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import promoRoutes from "./routes/promoRoutes";

const app = express();

// ✅ Proper CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      "http://localhost:3001", // local frontend
      "https://bookit-frontend.vercel.app", // replace with your deployed frontend later
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.use("/experiences", experienceRoutes);
    app.use("/bookings", bookingRoutes);
    app.use("/promo", promoRoutes);

    app.get("/", (_req: Request, res: Response) => {
      res.send("BookIt Backend Running 🚀");
    });

    app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  });
