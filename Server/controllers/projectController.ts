import { Request, Response } from "express";
import { prisma } from "../configs/prisma.js";
import { v2 as cloudinary } from "cloudinary";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import fs from "fs";
import ai from "../configs/ai.js";
import axios from "axios";
import path from "path";

const loadImage = (path: string, mineType: string) => {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mineType,
    },
  };
};

export const createProject = async (req: Request, res: Response) => {
  let tempProjectId: string;
  const { userId } = req.auth?.() || {};
  let isCreditsDeduced = false;
  const {
    name = "New Project",
    aspectRatio,
    userPrompt,
    productName,
    productDescription,
    targetLength = 5,
  } = req.body;
  const images: any = req.files;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (
    images.length === 0 ||
    !name ||
    !aspectRatio ||
    !userPrompt ||
    !productName ||
    !productDescription ||
    !targetLength
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  if (!user || !user.credits) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    await prisma.user
      .update({
        where: { id: userId },
        data: { credits: { decrement: 5 } },
      })
      .then(() => {
        isCreditsDeduced = true;
      });
  }
  try {
    let uploadedImages: any = await Promise.all(
      images.map(async (item: any) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    const project = await prisma.project.create({
      data: {
        name,
        aspectRatio,
        userPrompt,
        productName,
        productDescription,
        targetLength: parseInt(targetLength),
        userId,
        uploadedImages,
        isGenerating: true,
        isPublished: false,
      },
    });
    tempProjectId = project.id;
    const model = "gemini-3-pro-image-preview";

    const generationConfig: GenerateContentConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["image"],
      imageConfig: {
        aspectRatio: aspectRatio || "9:16",
        imageSize: "1K",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };

    //image to base64 structure for ai model
    const img1base64 = loadImage(images[0].path, images[0].mineType);
    const img2base64 = loadImage(images[1].path, images[1].mineType);
    const prompt = {
      text: `Combine the person and product into a realistic photo.
      Make the person naturally hold or use the product.
      Match lighting,shadows,scale and perspective.
      Make the person stand in professional studio lighting.
      Output ecommerse-quality photo realustic imagery.${userPrompt}3.
      // The person should be ${productName} and the product should be ${productDescription}.`,
      images: [img1base64, img2base64],
    };

    //generate the image using the ai model
    const response: any = await ai.models.generateContent({
      model,
      contents: [img1base64, img2base64, prompt],
      config: generationConfig,
    });
    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("Failed to generate image");
    }
    const parts = response?.candidates[0].content.parts;

    let finalBuffer: Buffer | null = null;

    for (const part of parts) {
      if (part.inlineData) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!finalBuffer) {
      throw new Error("Failed to generate image");
    }
    const base64Image = `data:image/png;base64,${finalBuffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
    });

    await prisma.project.update({
      where: { id: project.id },
      data: { isGenerating: false, generatedImage: uploadResult.secure_url },
    });
    return res.status(200).json({
      message: "Project created successfully!",
      project,
      isCreditsDeduced,
      isGenerating: false,
      generatedImage: uploadResult.secure_url,
      projectId: project.id,
    });
  } catch (error: any) {
    if (tempProjectId!) {
      //update the project status and error message
      await prisma.project.update({
        where: { id: tempProjectId },
        data: { isGenerating: false, error: error.message },
      });
    }
    if (isCreditsDeduced) {
      //Add credit back to the user
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
    }
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const createVideo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.auth?.() || {};
    const { projectId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project id is required" });
    }

    let isCreditsDeduced = false;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user || user.credits < 10) {
      return res.status(401).json({
        message: "Not enough credits",
      });
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 10 } },
    });
    isCreditsDeduced = true;

    // Get project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.generatedVideo) {
      return res.status(200).json({
        message: "Video already generated",
        project,
      });
    }

    if (!project.generatedImage) {
      throw new Error("Image not generated");
    }

    // Set generating state
    await prisma.project.update({
      where: { id: projectId },
      data: { isGenerating: true },
    });

    const prompt = `Make the person showcase the product "${project.productName}" ${
      project.productDescription ? `and ${project.productDescription}` : ""
    } in a professional way.`;

    const model = "veo-3.1-generate-preview";

    // Fetch image
    const image = await axios.get(project.generatedImage, {
      responseType: "arraybuffer",
    });

    const imageBytes = Buffer.from(image.data);

    // Start generation
    let operation = await ai.models.generateVideos({
      model,
      prompt,
      image: {
        imageBytes: imageBytes.toString("base64"),
        mimeType: "image/png",
      },
      config: {
        aspectRatio: project.aspectRatio || "9:16",
        numberOfVideos: 1,
        resolution: "720p",
      },
    });

    // Polling
    while (!operation.done) {
      console.log("⏳ Waiting for video generation...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      operation = await ai.operations.getVideosOperation({
        operation,
      });
    }

    if (!operation.response?.generatedVideos?.length) {
      throw new Error("Video generation failed");
    }

    const filename = `video-${userId}-${project.id}-${Date.now()}.mp4`;
    const filePath = path.join(process.cwd(), "public/videos", filename);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Download video
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: filePath,
    });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
    });

    // Update project
    await prisma.project.update({
      where: { id: projectId },
      data: {
        isGenerating: false,
        generatedVideo: uploadResult.secure_url,
      },
    });

    // Delete local file
    await fs.promises.unlink(filePath);

    return res.status(200).json({
      message: "Video generated successfully!",
      videoUrl: uploadResult.secure_url,
      isCreditsDeduced,
      projectId: project.id,
    });

  } catch (error) {
    console.error("❌ Error:", error);

    // OPTIONAL: refund credits if failed
    try {
      const { userId } = req.auth?.() || {};
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: 10 } },
        });
      }
    } catch (refundError) {
      console.error("Refund failed:", refundError);
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const createImage = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPublishProjects = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
