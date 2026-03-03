import { Loader2Icon } from "lucide-react";
import type { Project } from "../types";
import { type Dispatch, type SetStateAction } from "react";

const Projectcards = ({
  gen,
  setGenerations,
  forCommunity = false,
}: {
  gen: Project;
  setGenerations: Dispatch<SetStateAction<Project[]>>;
  forCommunity?: boolean;
}) => {
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">
        {/* preview */}
        <div
          className={`${
            gen?.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
          } relative overflow-hidden`}
        >
          {/* Image */}
          {gen.generatedImage && (
            <img
              src={gen.generatedImage}
              alt={gen.productName}
              className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
                gen.generatedVideo
                  ? "opacity-100 group-hover:opacity-0"
                  : "group-hover:scale-105"
              }`}
            />
          )}

          {/* Video */}
          {gen.generatedVideo && (
            <video
              src={gen.generatedVideo}
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
            />
          )}
          {!gen?.generatedImage && !gen?.generatedVideo && (
            <div className="absolute insert-0 w-full h-full flex flex-col items-center justify-center bg-black/20">
              <Loader2Icon />
            </div>
          )}
          {/* status badges */}
          <div className="absolute left-3 top-3 flex gap-2 items-center">
            {gen.isGenerating && (
              <span className="text-xs px-2 py-1 bg-yellow-600/30 rounded-full">
                Generating
              </span>
            )}
          </div>
          <div className="absolute left-3 top-3 flex gap-2 items-center">
            {gen.isPublished && (
              <span className="text-xs px-2 py-1 bg-green-600/30 rounded-full">
                Published
              </span>
            )}
          </div>
          {/* source images */}
          <div className="absolute right-3 bottom-3">
            <img
              src={gen.uploadedImages[0]}
              alt="product"
              className="w-16 h-16 object-cover rounded-full animated-float"
            />
            <img
              src={gen.uploadedImages[1]}
              alt="product"
              className="w-16 h-16 object-cover rounded-full animated-float -ml-8"
              style={{ animationDelay: "3s" }}
            />
            {/* details? */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3>{gen.productName}</h3>
                  <p>Created:{new Date(gen.createdAt).toLocaleString()}</p>
                  {gen.updatedAt && (
                    <p>Updated:{new Date(gen.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projectcards;
