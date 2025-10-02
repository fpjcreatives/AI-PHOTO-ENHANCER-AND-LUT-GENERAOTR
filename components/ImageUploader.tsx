import React from 'react';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, fileInputRef }) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          onImageUpload(e.dataTransfer.files);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="w-full max-w-2xl h-96 flex flex-col items-center justify-center border-4 border-dashed border-gray-700 rounded-2xl cursor-pointer bg-gray-800/50 hover:bg-gray-800 hover:border-cyan-500 transition-all duration-300 group"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        multiple
      />
      <div className="text-center p-8">
        <UploadIcon className="mx-auto h-16 w-16 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
        <h3 className="mt-4 text-2xl font-semibold text-gray-300 group-hover:text-white">
          Upload Image(s)
        </h3>
        <p className="mt-2 text-gray-500">
          Click or drag file(s) here to get started.
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
