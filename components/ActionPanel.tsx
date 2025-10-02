
import React from 'react';

// This type should be kept in sync with the one in App.tsx
type ExportSize = 'original' | '1024' | '2048' | '4k';

interface ActionPanelProps {
  onEnhance: () => void;
  onReset: () => void;
  onDownload?: string | null;
  onBulkDownload: () => void;
  onExportLut: () => void;
  isLoading: boolean;
  isZipping: boolean;
  isGeneratingLut: boolean;
  isEnhanced: boolean;
  imageCount: number;
  baseColor: string;
  onBaseColorChange: (value: string) => void;
  exportSize: ExportSize;
  onExportSizeChange: (value: ExportSize) => void;
  autoAlign: boolean;
  onAutoAlignChange: (value: boolean) => void;
  autoCrop: boolean;
  onAutoCropChange: (value: boolean) => void;
  onApiKeyChangeRequest: () => void;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9z" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const ArchiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);

const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
);


const ResetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);


const ActionPanel: React.FC<ActionPanelProps> = ({ 
    onEnhance, onReset, onDownload, onBulkDownload, onExportLut,
    isLoading, isZipping, isGeneratingLut, isEnhanced, imageCount,
    baseColor, onBaseColorChange, exportSize, onExportSizeChange,
    autoAlign, onAutoAlignChange, autoCrop, onAutoCropChange,
    onApiKeyChangeRequest,
}) => {
  const isAnyProcessRunning = isLoading || isZipping || isGeneratingLut;
  return (
    <div className="w-full max-w-4xl mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-6">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="baseColor" className="block text-sm font-medium text-gray-300 mb-2">
                {imageCount > 1 ? "Base Color / Style (Optional)" : "Style Prompt (Optional)"}
            </label>
            <input
                id="baseColor"
                type="text"
                value={baseColor}
                onChange={(e) => onBaseColorChange(e.target.value)}
                placeholder="e.g., warm vintage tones, cool cinematic..."
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 h-[42px]"
                disabled={isAnyProcessRunning}
            />
        </div>
        <div>
            <label htmlFor="exportSize" className="block text-sm font-medium text-gray-300 mb-2">
                Export Size
            </label>
            <select
                id="exportSize"
                value={exportSize}
                onChange={(e) => onExportSizeChange(e.target.value as ExportSize)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 h-[42px]"
                disabled={isAnyProcessRunning}
            >
                <option value="original">Original Size</option>
                <option value="1024">1024px (Longest Side)</option>
                <option value="2048">2048px (Longest Side)</option>
                <option value="4k">4K (3840px)</option>
            </select>
        </div>
      </div>

      <div className="w-full flex items-center justify-center gap-x-8 gap-y-4 flex-wrap">
          <label htmlFor="autoAlign" className="flex items-center cursor-pointer">
              <div className="relative">
                  <input id="autoAlign" type="checkbox" className="sr-only" checked={autoAlign} onChange={(e) => onAutoAlignChange(e.target.checked)} disabled={isAnyProcessRunning} />
                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
              </div>
              <div className="ml-3 text-gray-300 font-medium">Auto Align</div>
          </label>
          <label htmlFor="autoCrop" className="flex items-center cursor-pointer">
              <div className="relative">
                  <input id="autoCrop" type="checkbox" className="sr-only" checked={autoCrop} onChange={(e) => onAutoCropChange(e.target.checked)} disabled={isAnyProcessRunning} />
                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
              </div>
              <div className="ml-3 text-gray-300 font-medium">Auto Crop</div>
          </label>
           <style>{`
                input:checked ~ .dot {
                    transform: translateX(100%);
                    background-color: #0891b2; /* cyan-600 */
                }
                 input:checked ~ .block {
                    background-color: #67e8f9; /* cyan-300 */
                }
            `}</style>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
        <button
          onClick={onEnhance}
          disabled={isAnyProcessRunning}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-300"
        >
          <SparklesIcon className="w-6 h-6" />
          {isLoading ? 'Enhancing...' : imageCount > 1 ? `Enhance ${imageCount} Images` : 'Auto Color'}
        </button>

        {isEnhanced && imageCount === 1 && onDownload && (
          <a
            href={onDownload}
            download="enhanced-image.png"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors duration-300"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </a>
        )}
        
        {isEnhanced && imageCount === 1 && onDownload && (
          <button
            onClick={onExportLut}
            disabled={isAnyProcessRunning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-colors duration-300"
          >
            <FilmIcon className="w-5 h-5" />
            {isGeneratingLut ? 'Generating LUT...' : 'Export LUT'}
          </button>
        )}

        {isEnhanced && imageCount > 1 && (
            <button
                onClick={onBulkDownload}
                disabled={isAnyProcessRunning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-colors duration-300"
            >
                <ArchiveIcon className="w-5 h-5" />
                {isZipping ? 'Zipping...' : 'Download All'}
            </button>
        )}

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors duration-300"
          title="Start Over"
        >
          <ResetIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onApiKeyChangeRequest}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors duration-300"
          title="Change API Key"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;
