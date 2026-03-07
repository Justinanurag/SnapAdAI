import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { Loader2Icon } from "lucide-react";

const Results = () => {
  const [project, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // API call to fetch data
  const fetchProjectData = async () => {
    try {
      setLoading(true);

      // simulate API delay
      setTimeout(() => {
        setProjectData(dummyGenerations[0]);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2Icon className="animate-spin text-indigo-500 size-10" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        No project found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">

      {/* Preview */}
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        {project.generatedImage && (
          <img
            src={project.generatedImage}
            alt={project.productName}
            className="w-full object-cover"
          />
        )}

        {project.generatedVideo && (
          <video
            src={project.generatedVideo}
            controls
            className="w-full"
          />
        )}
      </div>

      {/* Info */}
      <div className="mt-6 space-y-3">

        <h2 className="text-xl font-semibold">
          {project.productName}
        </h2>

        <p className="text-sm text-gray-400">
          Created: {new Date(project.createdAt).toLocaleString()}
        </p>

        {project.productDescription && (
          <p className="text-gray-300 leading-relaxed">
            {project.productDescription}
          </p>
        )}

        {project.userPrompt && (
          <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-gray-300">{project.userPrompt}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Results;