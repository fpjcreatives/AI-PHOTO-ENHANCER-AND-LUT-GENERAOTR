
import React from 'react';
import Loader from './Loader';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
}

const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);


const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-2xl font-semibold text-gray-300">{title}</h2>
      <div className="aspect-square w-full bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-gray-700">
        {isLoading && <Loader />}
        {!isLoading && !imageUrl && (
            <div className="text-center text-gray-500">
                <ImageIcon className="mx-auto h-24 w-24 opacity-30" />
                <p className="mt-4">AI enhanced image will appear here</p>
            </div>
        )}
        {!isLoading && imageUrl && (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
