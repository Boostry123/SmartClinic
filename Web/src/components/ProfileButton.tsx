import React from "react";
import { User } from "lucide-react";

interface ProfileButtonProps {
  onClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative flex items-center justify-center 
        w-9 h-9 rounded-xl 
        bg-indigo-500/20 border border-indigo-500/20
        text-cyan-300 
        transition-all duration-300 
        /* Hover State - Matching your Nav items */
        hover:scale-105 
        hover:bg-indigo-500/30 
        hover:border-white/10 
        hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]
        /* Active/Click State */
        active:scale-95
      "
      title="View Profile"
    >
      <User size={18} />
    </button>
  );
};

export default ProfileButton;
