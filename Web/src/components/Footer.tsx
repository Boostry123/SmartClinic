import React from "react";
import { DateTime } from "luxon";
// 1. Import the image so the build tool can find it
import githubLogo from "../assets/GitHub_Invertocat_Black.png";

const Footer: React.FC = () => {
  const year = DateTime.now().year.toString();

  return (
    <footer className="w-full bg-white shadow-inner p-6 flex flex-col items-center justify-center gap-4 text-gray-700">
      <a
        href="https://github.com/Boostry123/SmartClinic.git"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SmartClinic GitHub Repository"
        className="hover:opacity-75 transition-opacity"
      >
        <img
          src={githubLogo} // 2. Use the imported variable
          alt="GitHub Icon"
          width="30"
          height="30"
        />
      </a>
      <p>© {year} SmartClinic - All rights reserved.</p>
    </footer>
  );
};

export default Footer;
