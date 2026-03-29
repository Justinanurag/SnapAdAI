import express from "express";

import { protect } from "../Middleware/auth.js";
import { createImage, createProject, createVideo,getAllPublishProjects ,deleteProject} from "../controllers/projectController.js";
import upload from "../configs/multer.js";

const projectRoutes = express.Router();

projectRoutes.post("/create",upload.array("images",2) ,protect, createProject);
projectRoutes.post("/video", protect, createVideo);
projectRoutes.get("/publish/:projectId", protect, createImage);
projectRoutes.delete("/:projectId", protect, deleteProject);
projectRoutes.get("/published", protect, getAllPublishProjects);

export default projectRoutes;
