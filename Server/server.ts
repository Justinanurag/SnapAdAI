import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./configs/prisma.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhook from "./controllers/clerk.js";
dotenv.config();

const app = express();
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);
app.use(express.json());
app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;
connectDB(); //connection check
//middleware
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("Snap-ad-ai server is live 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
