import React, { useState, useRef } from 'react';
import { Upload, X, ArrowRight, Loader2, ClipboardCheck, Image as ImageIcon } from 'lucide-react';
import { fileToBase64, analyzeImageStream } from '../services/geminiService';
import MarkdownView from './MarkdownView';

const VisionView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setImage(base64);
        setMimeType(file.type);
        setResult(''); // Clear previous results
      } catch (error) {
        console.error("Error reading file", error);
      }
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setMimeType('');
    setResult('');
    setPrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!image || isLoading) return;

    setIsLoading(true);
    setResult('');
    
    // Default prompt if none provided, tailored for warranty analysis
    const effectivePrompt = prompt || "Analyze this image for construction defects, maintenance issues, or warranty claim details. Be professional and technical.";

    try {
      await analyzeImageStream(image, effectivePrompt, mimeType, (text) => {
        setResult(text);
      });
    } catch (error) {
      setResult("Failed to process the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-primary-50">
      
      {/* Header - Rebranded */}
      <div className="p-6 md:p-8 pb-6 bg-white border-b border-primary-100 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-3">
           <div className="bg-primary-100 p-3 rounded-2xl text-primary-700">
             <ClipboardCheck size={28} />
           </div>
           <h2 className="text-2xl md:text-3xl font-bold text-primary-900">Make a Warranty Request</h2>
        </div>
        <p className="text-primary-600 max-w-2xl text-lg">
          Upload a photo of the issue you are experiencing. Our system will analyze the defect and help start your warranty claim process.
        </p>
      </div>

      <div className="flex-1 p-6 md:p-8 pt-0 flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Input */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          
          {/* Image Uploader */}
          <div className="relative group">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video w-full rounded-[2rem] border-2 border-dashed border-primary-300 bg-white hover:bg-primary-50 hover:border-primary-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-primary-400 group-hover:text-primary-600 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                  <Upload size={32} />
                </div>
                <div className="text-center px-4">
                  <p className="font-bold text-lg">Upload Defect Photo</p>
                  <p className="text-sm mt-1 text-primary-400">Click or Drag Image Here</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg border border-primary-200 bg-white aspect-auto">
                <img src={image} alt="Uploaded preview" className="w-full h-auto max-h-[400px] object-contain bg-slate-50" />
                <button 
                  onClick={handleClearImage}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-primary-700 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-md border border-primary-100"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden" 
            />
          </div>

          {/* Prompt Input */}
          <div className={`transition-all duration-500 ${image ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
            <label className="block text-sm font-bold text-primary-700 mb-2 ml-2 uppercase tracking-wide">
              Describe the issue (optional)
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Water dripping from the ceiling vent in the master bath..."
                className="w-full rounded-[1.5rem] border-primary-200 bg-white px-5 py-4 text-primary-800 focus:border-primary-500 focus:ring-primary-500 shadow-sm text-base"
                rows={4}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !image}
                className="absolute bottom-3 right-3 px-6 py-2.5 bg-primary-700 text-white rounded-full shadow-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <span>Analyze</span>}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="w-full md:w-2/3">
          <div className="h-full min-h-[400px] rounded-[2.5rem] bg-white border border-primary-200 p-8 shadow-sm flex flex-col relative overflow-hidden">
            {result ? (
              <div className="overflow-y-auto custom-scrollbar pr-2">
                <div className="flex items-center gap-2 mb-6 text-primary-700 bg-primary-100 w-fit px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ClipboardCheck size={16} />
                  Preliminary Assessment
                </div>
                <MarkdownView content={result} />
                <div className="mt-8 pt-6 border-t border-primary-100 flex flex-wrap gap-4">
                  <button className="px-8 py-3 bg-primary-700 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-md">
                    Submit Formal Claim
                  </button>
                  <button className="px-8 py-3 border border-primary-300 text-primary-700 rounded-full font-medium hover:bg-primary-50 transition-colors">
                    Save as Draft
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-primary-300 text-center p-8">
                <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mb-6 border border-primary-100">
                  <ImageIcon size={48} className="text-primary-300" />
                </div>
                <p className="text-xl font-medium text-primary-400 mb-2">Waiting for image...</p>
                <p className="text-base max-w-xs text-primary-300">
                  Upload a photo of the defect to receive an instant preliminary assessment and category classification.
                </p>
              </div>
            )}
            
            {/* Loading Overlay */}
            {isLoading && !result && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={48} className="animate-spin text-primary-700" />
                  <p className="text-primary-700 font-medium text-lg">Analyzing defect...</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VisionView;