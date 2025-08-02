import React, { useState, useCallback } from 'react';
import { Upload, Camera, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ArtUploaderProps {
  onImageUpload: (file: File) => void;
  isAnalyzing?: boolean;
}

export const ArtUploader: React.FC<ArtUploaderProps> = ({ onImageUpload, isAnalyzing = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!previewUrl ? (
        <Card
          className={cn(
            "relative border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer hover:border-gallery-accent hover:bg-gallery-bg",
            isDragOver ? "border-gallery-accent bg-gallery-bg scale-105" : "border-border",
            isAnalyzing && "opacity-50 pointer-events-none"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isAnalyzing}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center">
              {isAnalyzing ? (
                <Sparkles className="w-8 h-8 text-white animate-pulse-glow" />
              ) : (
                <Upload className="w-8 h-8 text-white" />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isAnalyzing ? 'Analyzing Your Art Print...' : 'Upload Your Art Print'}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {isAnalyzing 
                  ? 'Our AI is examining your artwork to provide accurate valuation'
                  : 'Drag and drop your image here, or click to browse'
                }
              </p>
            </div>
            
            {!isAnalyzing && (
              <div className="flex items-center space-x-4">
                <Button variant="premium" className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Choose Photo</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  JPG, PNG up to 10MB
                </span>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="relative overflow-hidden shadow-elegant">
          <div className="aspect-video relative">
            <img
              src={previewUrl}
              alt="Art print preview"
              className="w-full h-full object-contain bg-gallery-bg"
            />
            {!isAnalyzing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={clearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-gallery-accent animate-pulse-glow" />
                  <span className="text-sm font-medium">Analyzing artwork...</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};