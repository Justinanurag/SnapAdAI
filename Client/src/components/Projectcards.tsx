import {
  EllipsisIcon,
  ImageIcon,
  Loader2Icon,
  Share2Icon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import type { Project } from "../types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { GhostButton, PrimaryButton } from "./Buttons";

const Projectcards = ({
  gen,
  // setGenerations,
  forCommunity = false,
}: {
  gen: Project;
  setGenerations: Dispatch<SetStateAction<Project[]>>;
  forCommunity?: boolean;
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const togglePublish = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6b7280",
    });
    if (result.isConfirmed) {
      try {
        await axios.post(`/api/generation/publish/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/generation/${id}`);

        Swal.fire({
          title: "Deleted!",
          text: "Your item has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Optional: refresh data or update state
        // setData(prev => prev.filter(item => item._id !== id));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  };
  return (
    <div className="mb-6 break-inside-avoid">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition group">
        {/* IMAGE / VIDEO PREVIEW */}
        <div
          className={`${
            gen?.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
          } relative overflow-hidden`}
        >
          {/* Action menu for my generations only */}
          {!forCommunity && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
              {/* Button */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center justify-center w-8 h-8 rounded-full
      bg-black/40 backdrop-blur-md border border-white/10
      hover:bg-black/60 transition"
              >
                <EllipsisIcon className="size-4 text-white" />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-black/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg z-20 overflow-hidden">
                  <ul className="text-sm text-white">
                    {gen.generatedImage && (
                      <li>
                        <a
                          href={gen.generatedImage}
                          download
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
                        >
                          <ImageIcon size={14} />
                          Download Image
                        </a>
                      </li>
                    )}

                    {gen.generatedVideo && (
                      <li>
                        <a
                          href={gen.generatedVideo}
                          download
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
                        >
                          <VideoIcon size={14} />
                          Download Video
                        </a>
                      </li>
                    )}

                    {(gen.generatedVideo || gen.generatedImage) && (
                      <li>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                url: gen.generatedVideo || gen.generatedImage,
                                title: gen.productName,
                                text:
                                  gen.productDescription || "Check this out!",
                              });
                            } else {
                              navigator.clipboard.writeText(
                                gen.generatedVideo || gen.generatedImage || "",
                              );
                              alert("Link copied!");
                            }
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition"
                        >
                          <Share2Icon size={14} />
                          Share
                        </button>
                      </li>
                    )}

                    <li className="border-t border-white/10"></li>

                    <li>
                      <button
                        onClick={() => handleDelete(gen.id)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2Icon size={14} />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {/* IMAGE */}
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

          {/* VIDEO */}
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2Icon className="animate-spin text-white" />
            </div>
          )}

          {/* STATUS BADGES */}
          <div className="absolute top-3 left-3 flex gap-2">
            {gen.isGenerating && (
              <span className="text-xs px-2 py-1 bg-yellow-600/30 rounded-full">
                Generating
              </span>
            )}
            {gen.isPublished && (
              <span className="text-xs px-2 py-1 bg-green-600/30 rounded-full">
                Published
              </span>
            )}
          </div>
        </div>
        {/* DETAILS SECTION */}
        <div className="p-4 space-y-4">
          {/* Uploaded Images */}
          <div className="flex items-center">
            <img
              src={gen.uploadedImages[0]}
              alt="product"
              className="w-12 h-12 object-cover rounded-full border-2 border-black/40"
            />

            {gen.uploadedImages[1] && (
              <img
                src={gen.uploadedImages[1]}
                alt="product"
                className="w-12 h-12 object-cover rounded-full border-2 border-black/40 -ml-4"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {gen.productName}
              </h3>

              <p className="text-xs text-gray-400">
                Created: {new Date(gen.createdAt).toLocaleString()}
              </p>

              {gen.updatedAt && (
                <p className="text-xs text-gray-500">
                  Updated: {new Date(gen.updatedAt).toLocaleString()}
                </p>
              )}
            </div>

            <span className="text-xs px-2 py-1 bg-white/10 border border-white/20 rounded-full text-gray-300">
              {gen.aspectRatio}
            </span>
          </div>

          {/* Description */}
          {gen.productDescription && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {gen.productDescription}
              </p>
            </div>
          )}
          {gen.userPrompt && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-sm text-gray-300 leading-relaxed">
                {gen.userPrompt}
              </p>
            </div>
          )}
          {/* buttons */}
          {!forCommunity && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <GhostButton
                className="text-xs justify-center"
                onClick={() => {
                  navigate(`/results/${gen.id}`);
                  scrollTo(0, 0);
                }}
              >
                View Details
              </GhostButton>
              <PrimaryButton
                onClick={() => togglePublish(gen.id)}
                className="rounded-md"
              >
                {gen.isPublished ? "Unpublish" : "Publish"}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projectcards;
