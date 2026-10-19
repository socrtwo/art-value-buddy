import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ArtUploader } from '@/components/ArtUploader';
import type { PosterData } from '@/components/ArtUploader';
import { ValuationResults } from '@/components/ValuationResults';
import { analyzeArtwork } from '@/utils/artAnalysis';
import type { ArtAnalysisResult } from '@/utils/artAnalysis';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [valuationData, setValuationData] = useState<ArtAnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (data: PosterData) => {
    setIsAnalyzing(true);
    const url = URL.createObjectURL(data.file);
    setImageUrl(url);

    try {
      const analysis = await analyzeArtwork(
        data.file,
        data.width,
        data.height,
        data.name,
        data.artist,
        data.year,
        data.category,
        data.edition,
      );
      setValuationData(analysis);

      toast({
        title: "Analysis Complete!",
        description: `Your ${analysis.title} has been analyzed and valued with ${analysis.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your poster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setValuationData(null);
    setIsAnalyzing(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-gallery">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!valuationData ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground">
                Identify & Value Your Poster
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload a photo of your poster and provide details for an accurate,
                market-based valuation using our reference database of collectible posters.
              </p>
            </div>

            <ArtUploader onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />

            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-high/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="font-semibold">Reference Database</h3>
                  <p className="text-sm text-muted-foreground">
                    Matches against 50+ iconic posters with verified market values across 11 categories
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-medium/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold">Multi-Factor Valuation</h3>
                  <p className="text-sm text-muted-foreground">
                    Condition, age, size, edition type, and category all factor into the estimate
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-low/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="font-semibold">Condition Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Computer vision analyzes your photo for brightness, sharpness, and edge damage
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleStartOver}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Analyze Another Poster</span>
              </Button>
            </div>

            {imageUrl && (
              <ValuationResults data={valuationData} imageUrl={imageUrl} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
