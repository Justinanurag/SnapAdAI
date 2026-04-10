import express from 'express'
import { getAllProjects, getProjectById, getUserCredits,publishProject } from '../controllers/userController.js';
import { protect } from '../Middleware/auth.js';


const userRoutes=express.Router();

userRoutes.get('/credits',protect,getUserCredits);
userRoutes.get('/projects',protect,getAllProjects);
userRoutes.get('/projects/:projectId',protect,getProjectById);
userRoutes.patch('/publish/:projectId',protect,publishProject);

export default userRoutes