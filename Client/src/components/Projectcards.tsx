import { useNavigate } from "react-router-dom";
import type { Project } from "../types";
import type { Dispatch, SetStateAction } from "react";

const Projectcards = ({
  gen,
  setGenerations,
  forCommunity = false,
}: {
  gen: Project;
  setGenerations: Dispatch<React.SetStateAction<Project[]>>;
  forCommunity?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div key={gen.id} className="mb-4 break-inside-avoid">
      <div className="bg-white/5 border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition group">
        {/* preview */}
        <div>
          {gen.generateImages && (
            <img
              src={gen.generateImages}
              alt={gen.productName}
              className={``}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Projectcards;
