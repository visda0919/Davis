import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Upload, X, Loader2, FileImage } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API if needed, but SDK handles inlineData well.
        // Usually SDK needs the base64 part only, let's strip the prefix just in case or use it directly depending on SDK helper.
        // The generateContent helper in SDK expects raw base64 data usually.
        const base64Data = base64String.split(',')[1];
        setImage(base64Data);
        setAnalysis(""); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(image, "Analyze this financial chart or document in detail. What are the key takeaways for an investor?");
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Error analyzing image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <FileImage size={20} className="text-purple-400" />
          AI Document Analysis
        </h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-64 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-slate-800/50 transition-colors group"
          >
            <div className="p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 mb-4 transition-colors">
              <Upload className="text-slate-400 group-hover:text-purple-400" size={32} />
            </div>
            <p className="text-slate-400 font-medium">Click to upload Chart or Report</p>
            <p className="text-slate-500 text-xs mt-2">Supports JPG, PNG</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-black flex justify-center border border-slate-700">
              <img 
                src={`data:image/jpeg;base64,${image}`} 
                alt="Upload preview" 
                className="max-h-64 object-contain"
              />
              <button 
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {!analysis && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileImage size={18} />
                    Analyze with Gemini 3 Pro
                  </>
                )}
              </button>
            )}

            {analysis && (
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h4 className="text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">AI Analysis Result</h4>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};

export default ImageAnalyzer;
