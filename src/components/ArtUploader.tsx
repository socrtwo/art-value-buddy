import React, { useState, useCallback } from 'react';
import { Upload, Camera, X, Sparkles, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PosterData {
  file: File;
  width: string;
  height: string;
  name: string;
  artist: string;
  year: string;
}

interface ArtUploaderProps {
  onImageUpload: (data: PosterData) => void;
  isAnalyzing?: boolean;
}

export const ArtUploader: React.FC<ArtUploaderProps> = ({ onImageUpload, isAnalyzing = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');

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
      setSelectedFile(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile && width && height) {
      onImageUpload({
        file: selectedFile,
        width,
        height,
        name: name || 'Unknown Poster',
        artist: artist || 'Unknown Artist',
        year: year || new Date().getFullYear().toString()
      });
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
    setSelectedFile(null);
    setWidth('');
    setHeight('');
    setName('');
    setArtist('');
    setYear('');
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
                {isAnalyzing ? 'Identifying Your Poster...' : 'Upload Your Poster'}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {isAnalyzing 
                  ? 'Our AI is searching online databases to identify and value your poster'
                  : 'Drag and drop your poster image here, or click to browse'
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
        <div className="space-y-4">
          <Card className="relative overflow-hidden shadow-elegant">
            <div className="aspect-video relative">
              <img
                src={previewUrl}
                alt="Poster preview"
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
                    <span className="text-sm font-medium">Identifying poster...</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {!isAnalyzing && (
            <div className="space-y-4">
              <Card className="p-6 shadow-elegant">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Ruler className="w-5 h-5 text-gallery-accent" />
                    <h3 className="text-lg font-semibold">Poster Details</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Poster Name (Optional)</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Star Wars: A New Hope"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artist">Artist/Designer (Optional)</Label>
                      <Input
                        id="artist"
                        type="text"
                        placeholder="e.g., Drew Struzan"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Year (Optional)</Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="e.g., 1977"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Leave blank for modern prints (assumed last 20 years)</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-elegant">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dimensions (Required)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (inches)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="24"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (inches)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="36"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!selectedFile || !width || !height}
                    className="w-full"
                    variant="premium"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze & Value Poster
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};