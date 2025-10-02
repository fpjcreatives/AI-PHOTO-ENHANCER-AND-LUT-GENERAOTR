
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { setApiKey, removeApiKey, enhanceImageWithAutoColor, generateLutImage } from './services/geminiService';
import { fileToBase64, upscaleImage } from './utils/fileUtils';
import { generateNeutralHaldImage, convertHaldToCube } from './utils/lutUtils';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import ActionPanel from './components/ActionPanel';
import ImageCard from './components/ImageCard';
import ApiKeyModal from './components/ApiKeyModal';

// Declare JSZip as a global variable, as it's now included via a <script> tag.
declare const JSZip: any;

interface ImageJob {
  id: string;
  file: File;
  originalUrl: string;
  enhancedUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export type ExportSize = 'original' | '1024' | '2048' | '4k';

const App: React.FC = () => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ImageJob[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isGeneratingLut, setIsGeneratingLut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [baseColor, setBaseColor] = useState<string>('');
  const [exportSize, setExportSize] = useState<ExportSize>('original');
  const [autoAlign, setAutoAlign] = useState<boolean>(false);
  const [autoCrop, setAutoCrop] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialRender = useRef(true);

  const handleReset = useCallback(() => {
    jobs.forEach(job => {
        URL.revokeObjectURL(job.originalUrl)
        if (job.enhancedUrl && job.enhancedUrl.startsWith('blob:')) {
            URL.revokeObjectURL(job.enhancedUrl);
        }
    });
    setJobs([]);
    setError(null);
    setIsProcessing(false);
    setIsZipping(false);
    setIsGeneratingLut(false);
    setBaseColor('');
    setExportSize('original');
    setAutoAlign(false);
    setAutoCrop(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    isInitialRender.current = true; // Reset for the next batch
  }, [jobs]);

  // Effect to reset enhanced images if settings change after enhancement
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const hasEnhancedJobs = jobs.some(j => j.enhancedUrl);
    if (!hasEnhancedJobs) {
      return;
    }

    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.enhancedUrl) {
          if (job.enhancedUrl.startsWith('blob:')) {
            URL.revokeObjectURL(job.enhancedUrl);
          }
          return { ...job, enhancedUrl: null, error: null, isLoading: false };
        }
        return job;
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseColor, exportSize, autoAlign, autoCrop]);

  // Check for API key in local storage on initial render
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
      setApiKeyState(storedKey);
    }
  }, []);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    setApiKeyState(key);
  };

  const handleApiKeyChangeRequest = () => {
    removeApiKey();
    setApiKeyState(null);
  };
  
  const handleImageUpload = (files: FileList) => {
    if (files.length === 0) return;
    
    jobs.forEach(job => URL.revokeObjectURL(job.originalUrl));

    const newJobs: ImageJob[] = Array.from(files).map((file, index) => {
      if (file.type.startsWith('image/')) {
        return {
          id: `${Date.now()}-${index}`,
          file,
          originalUrl: URL.createObjectURL(file),
          enhancedUrl: null,
          isLoading: false,
          error: null,
        };
      }
      return null;
    }).filter((job): job is ImageJob => job !== null);

    if (newJobs.length > 0) {
      setJobs(newJobs);
      setError(null);
    } else {
      setJobs([]);
      setError('No valid image files were selected.');
    }
  };

  const handleEnhanceClick = useCallback(async () => {
    if (jobs.length === 0) {
      setError('Please upload an image first.');
      return;
    }
    if (!apiKey) {
      setError('API Key is not set. Please set it via the settings.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    for (const job of jobs) {
      if (job.enhancedUrl || job.error) continue;

      setJobs(prevJobs => prevJobs.map(j =>
        j.id === job.id ? { ...j, isLoading: true, error: null } : j
      ));

      try {
        const { base64, mimeType } = await fileToBase64(job.file);
        const enhancedImageBase64 = await enhanceImageWithAutoColor(
            base64, 
            mimeType, 
            baseColor, 
            exportSize,
            autoAlign,
            autoCrop
        );
        
        let finalImageUrl = `data:${mimeType};base64,${enhancedImageBase64}`;

        if (exportSize !== 'original') {
            finalImageUrl = await upscaleImage(finalImageUrl, exportSize);
        }

        setJobs(prevJobs => {
            const currentJob = prevJobs.find(j => j.id === job.id);
            if(currentJob?.enhancedUrl && currentJob.enhancedUrl.startsWith('blob:')) {
                URL.revokeObjectURL(currentJob.enhancedUrl);
            }
            return prevJobs.map(j =>
                j.id === job.id
                ? { ...j, enhancedUrl: finalImageUrl, isLoading: false }
                : j
            )
        });
      } catch (err) {
        console.error(`Failed to enhance ${job.file.name}:`, err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to enhance';
        setJobs(prevJobs => prevJobs.map(j =>
          j.id === job.id ? { ...j, error: errorMessage, isLoading: false } : j
        ));
      }
    }

    setIsProcessing(false);
  }, [jobs, baseColor, exportSize, autoAlign, autoCrop, apiKey]);
  
  const handleExportLut = async () => {
    const job = jobs[0];
    if (!job || !job.enhancedUrl) {
      setError("Cannot export LUT without a successfully enhanced image.");
      return;
    }

    setIsGeneratingLut(true);
    setError(null);
    try {
      const neutralHaldUrl = await generateNeutralHaldImage();
      const { base64: originalBase64, mimeType } = await fileToBase64(job.file);
      const enhancedResponse = await fetch(job.enhancedUrl);
      const enhancedBlob = await enhancedResponse.blob();
      const enhancedBase64 = (await fileToBase64(new File([enhancedBlob], "enhanced.png", {type: mimeType}))).base64;
      const neutralHaldBase64 = neutralHaldUrl.split(',')[1];
      
      const gradedHaldBase64 = await generateLutImage(originalBase64, enhancedBase64, neutralHaldBase64, mimeType);
      const gradedHaldUrl = `data:image/png;base64,${gradedHaldBase64}`;

      const cubeFileContent = await convertHaldToCube(gradedHaldUrl);
      
      const blob = new Blob([cubeFileContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const safeFilename = job.file.name.replace(/\.[^/.]+$/, "");
      link.download = `AI-LUT-${safeFilename}.cube`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (err) {
      console.error("Failed to generate LUT:", err);
      const errorMessage = err instanceof Error ? err.message : 'Could not generate the .cube LUT file.';
      setError(errorMessage);
    } finally {
      setIsGeneratingLut(false);
    }
  };

  const handleBulkDownload = async () => {
    const enhancedJobs = jobs.filter(job => job.enhancedUrl);
    if (enhancedJobs.length === 0) {
        setError("No images have been enhanced yet.");
        return;
    }

    setIsZipping(true);
    const zip = new JSZip();

    try {
        await Promise.all(enhancedJobs.map(async (job) => {
            if (job.enhancedUrl) {
                const response = await fetch(job.enhancedUrl);
                const blob = await response.blob();
                zip.file(`enhanced-${job.file.name}`, blob);
            }
        }));

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'enhanced-images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch (err) {
        console.error("Failed to create zip file:", err);
        setError("Could not create the zip file for download.");
    } finally {
        setIsZipping(false);
    }
  };

  if (!apiKey) {
    return <ApiKeyModal onSave={handleApiKeySave} />;
  }
  
  const hasJobs = jobs.length > 0;
  const isSingleJob = jobs.length === 1;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 bg-gray-900 font-sans">
      <Header />
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center justify-center mt-8">
        {!hasJobs && <ImageUploader onImageUpload={handleImageUpload} fileInputRef={fileInputRef} />}
        
        {hasJobs && (
          <div className="w-full flex flex-col items-center">
            {isSingleJob ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageDisplay title="Original" imageUrl={jobs[0].originalUrl} />
                <ImageDisplay title="Enhanced" imageUrl={jobs[0].enhancedUrl} isLoading={jobs[0].isLoading} />
              </div>
            ) : (
              <div className="w-full">
                <h2 className="text-3xl font-semibold text-gray-300 text-center mb-6">
                  Your Images <span className="text-gray-500">({jobs.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {jobs.map(job => (
                    <ImageCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}

            <ActionPanel
              onEnhance={handleEnhanceClick}
              onReset={handleReset}
              onDownload={isSingleJob ? jobs[0].enhancedUrl : null}
              onBulkDownload={handleBulkDownload}
              onExportLut={handleExportLut}
              isLoading={isProcessing}
              isZipping={isZipping}
              isGeneratingLut={isGeneratingLut}
              isEnhanced={jobs.some(j => !!j.enhancedUrl)}
              imageCount={jobs.length}
              baseColor={baseColor}
              onBaseColorChange={setBaseColor}
              exportSize={exportSize}
              onExportSizeChange={setExportSize}
              autoAlign={autoAlign}
              onAutoAlignChange={setAutoAlign}
              autoCrop={autoCrop}
              onAutoCropChange={setAutoCrop}
              onApiKeyChangeRequest={handleApiKeyChangeRequest}
            />
          </div>
        )}

        {error && (
          <div className="mt-6 text-center bg-red-900/50 text-red-300 border border-red-500 rounded-lg p-3 w-full max-w-md">
            <p>{error}</p>
          </div>
        )}
      </main>
      <footer className="w-full text-center py-4 mt-8 text-gray-500 text-sm">
        <p>Built with React, Tailwind CSS, and the Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
