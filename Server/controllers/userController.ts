import { Request, Response } from "express";
import { prisma } from "../configs/prisma.js";

export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({
        message: "credits fetched successfully!",
        credits: user?.credits,
      });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth?.() || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Projects fetched successfully!",
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get project by id

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth?.() || {};
    const projectId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project id is required" });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId as string,
        userId: userId,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project fetched successfully!",
      project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//publish and unpublish project

export const publishProject = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth?.() || {};
    const projectId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project id is required" });
    }

    const project = await prisma.project.findFirst({
      where:{id:projectId as string,userId:userId}
    })
    if(!project){
      return res.status(404).json({ message: "Project not found" });
    }
    await prisma.project.update({
      where:{id:projectId as string},
      data:{isPublished:!project.isPublished}
    })
    return res.status(200).json({
      message: "Project published successfully!",
      project,
      isPublished:!project.isPublished
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
