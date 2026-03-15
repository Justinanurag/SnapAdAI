import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import {
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
  SparkleIcon,
  Video,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GhostButton, PrimaryButton } from "../components/Buttons";

const Results = () => {
  const [project, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // API call to fetch data
  const fetchProjectData = async () => {
    try {
      setLoading(true);
      // simulate API delay
      setTimeout(() => {
        setProjectData(dummyGenerations[0]);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      setLoading(false);
    }
  };
  const handleGeneratingVideo = async () => {
    setIsGenerating(true);
  };
  useEffect(() => {
    fetchProjectData();
  }, []);

  // if (!project) {
  //   return (
  //     <div className="h-screen flex items-center justify-center text-gray-400">
  //       No project found
  //     </div>
  //   );
  // }

  return loading ? (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader2Icon className="animate-spin text-indigo-500 size-10" />
    </div>
  ) : (
    <div className="min-h-screen text-white p-6 md:p-12 mt-20">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              Generation Result
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              View and download your generated ad.
            </p>
          </div>

          <Link
            to="/generate"
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg 
        bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            <RefreshCwIcon className="w-4 h-4" />
            <span className="max-sm:hidden">New Generation</span>
          </Link>
        </header>
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10 items-start">
          {/* main Result Display */}
          <div
            className={`${project?.aspectRatio == "9:16" ? "aspect-9/16" : "aspect-video"} sm:max-h-200 rounded-xl bg-gray-900 overflow-hidden relative`}
          >
            <div className="glass-panel inline-block p-2 rounded-2xl">
              <div>
                {project?.generatedVideo ? (
                  <video
                    src={project.generatedVideo}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={project?.generatedImage}
                    alt="Generated Result"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* download Button */}
            <div className="relative glass-panel p-6 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4">Action</h3>

              <div className="flex flex-col gap-3">
                {/* Image Download */}
                <a href={project?.generatedImage} download>
                  <GhostButton
                    disabled={!project?.generatedImage}
                    className="w-full flex items-center justify-center gap-2 rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="size-4.5" />
                    Download Image
                  </GhostButton>
                </a>

                {/* Video Download */}
                <a href={project?.generatedVideo} download>
                  <GhostButton
                    disabled={!project?.generatedVideo}
                    className="w-full flex items-center justify-center gap-2 rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <VideoIcon className="size-4.5" />
                    Download Video
                  </GhostButton>
                </a>
              </div>
            </div>
            {/* generated video button */}

            <div className="relative glass-panel p-6 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Decorative Icon */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <VideoIcon className="size-24" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-semibold mb-2 tracking-tight">
                  Video Magic
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Turn your static image into a dynamic AI generated video
                  optimized for social media and advertisements.
                </p>

                {/* Action Section */}
                {!project?.generatedVideo ? (
                  <PrimaryButton
                    onClick={handleGeneratingVideo}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    {isGenerating ? (
                      <>Generating Video...</>
                    ) : (
                      <>
                        <SparkleIcon className="size-4" />
                        Generate Video
                      </>
                    )}
                  </PrimaryButton>
                ) : (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center text-sm font-medium flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Video Generated Successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
