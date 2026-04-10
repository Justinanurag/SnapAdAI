import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./configs/prisma.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhook from "./controllers/clerk.js";
import {arcjetMiddleware} from "./configs/arcjet.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
dotenv.config();

const app = express();
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);
app.use(express.json());
app.use(clerkMiddleware());
app.use(cors({
    origin: ["http://localhost:5173/","http://snap-ad-ai.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
// Arcjet protection (rate limiting, bot detection, shield)
app.use(arcjetMiddleware);
const PORT = process.env.PORT || 5000;
connectDB(); //connection check
//middleware
app.get("/", (req: Request, res: Response) => {
  res.send("Snap-ad-ai server is live 🚀");
});
app.use("/api/user",userRoutes);
app.use("/api/project",projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
