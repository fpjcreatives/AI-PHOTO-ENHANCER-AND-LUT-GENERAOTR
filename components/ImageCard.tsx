import React from 'react';
import Loader from './Loader';

// This interface should be kept in sync with the one in App.tsx
interface ImageJob {
    id: string;
    file: File;
    originalUrl: string;
    enhancedUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

interface ImageCardProps {
  job: ImageJob;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z" /></svg>
);


const ImageCard: React.FC<ImageCardProps> = ({ job }) => {
  const renderEnhancedContent = () => {
    if (job.isLoading) {
      return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
          <Loader />
        </div>
      );
    }

    if (job.error) {
      return (
        <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center p-2 text-center text-white backdrop-blur-sm">
          <ErrorIcon className="w-8 h-8 text-red-300" />
          <p className="text-xs font-semibold mt-1">{job.error}</p>
        </div>
      );
    }

    if (job.enhancedUrl) {
      return (
        <>
          <img src={job.enhancedUrl} alt={`Enhanced - ${job.file.name}`} className="w-full h-full object-cover" />
          <div className="absolute top-1 left-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            Enhanced
          </div>
          <a
            href={job.enhancedUrl}
            download={`enhanced-${job.file.name}`}
            className="absolute bottom-2 right-2 bg-cyan-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cyan-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Download enhanced image"
            onClick={(e) => e.stopPropagation()}
          >
            <DownloadIcon className="w-5 h-5" />
          </a>
        </>
      );
    }

    // Default placeholder
    return (
      <div className="text-center text-gray-500">
        <SparklesIcon className="mx-auto h-8 w-8 opacity-40" />
        <p className="mt-2 text-xs">Enhanced version will appear here</p>
      </div>
    );
  };

  return (
    <div className="aspect-[4/5] w-full bg-gray-800 rounded-lg overflow-hidden relative border-2 border-gray-700 group shadow-lg flex flex-col">
      {/* Original Image */}
      <div className="h-1/2 w-full overflow-hidden relative border-b-2 border-gray-600">
        <img src={job.originalUrl} alt={`Original - ${job.file.name}`} className="w-full h-full object-cover" />
        <div className="absolute top-1 left-2 bg-black/50 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
          Original
        </div>
      </div>

      {/* Enhanced Image Section */}
      <div className="h-1/2 w-full overflow-hidden bg-gray-900/50 flex items-center justify-center relative">
        {renderEnhancedContent()}
      </div>
    </div>
  );
};

export default ImageCard;
