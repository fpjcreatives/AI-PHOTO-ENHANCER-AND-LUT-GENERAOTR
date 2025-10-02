
import React from 'react';

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <CameraIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
          AI Photo Enhancer
        </h1>
      </div>
      <p className="text-gray-400 mt-2 text-lg">
        Instantly improve your photos with one click using Gemini Nano Banana.
      </p>
    </header>
  );
};

export default Header;
