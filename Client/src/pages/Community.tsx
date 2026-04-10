import { useEffect, useState } from "react";
import type { Project } from "../types";
import { dummyGenerations } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import Projectcards from "../components/Projectcards";
import toast from "react-hot-toast";
import api from "../configs/axios";
import { useAuth } from "@clerk/react";

const Community = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const fetchProjects = async () => {
    try {
      const token = await getToken();
      if (!token) {
        return;
      }

      setLoading(true);
      const { data } = await api.get("/api/project/published", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(data.projects);
      setLoading(false);
    } catch (error: any) {
      toast.error('Something went wrong while fetching projects');
      setLoading(false);
      console.log(error);
    }
  }
  //Dummy data call
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setProjects(dummyGenerations);
  //     setLoading(false);
  //   }, 3000);

  //   return () => clearTimeout(timeoutId);
  // }, []);
  //Api call
  useEffect(() => {
    fetchProjects();
  }, [])

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2Icon className="size-7 animate-spin text-indigo-400" />
    </div>
  ) : (
    <div className="min-h-screen text-white p-6 md:p-12 my-28">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">
            Community
          </h1>
          <p className="text-gray-400">
            See what others are creating with SnapAdAI
          </p>
        </header>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {projects.map((project) => (
            <Projectcards
              key={project.id}
              gen={project}
              setGenerations={setProjects}
              forCommunity
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;