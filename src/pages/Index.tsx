import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ArtUploader } from '@/components/ArtUploader';
import { ValuationResults } from '@/components/ValuationResults';
import { analyzeArtwork } from '@/utils/artAnalysis';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValuationData {
  title: string;
  artist: string;
  year: string;
  medium: string;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  style: string;
  dimensions: string;
  lowEstimate: number;
  highEstimate: number;
  marketTrend: 'rising' | 'stable' | 'declining';
  confidence: number;
  comparableSales: {
    price: number;
    date: string;
    source: string;
  }[];
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    try {
      const analysis = await analyzeArtwork(file);
      setValuationData(analysis);
      
      toast({
        title: "Analysis Complete!",
        description: `Your ${analysis.title} has been valued with ${analysis.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your artwork. Please try again.",
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
                Discover Your Art's Value
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload a photo of your art print and get an instant AI-powered valuation 
                based on market data, condition analysis, and comparable sales.
              </p>
            </div>
            
            <ArtUploader onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />
            
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-high/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="font-semibold">AI Art Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced computer vision identifies artists, styles, and periods
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-medium/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time market data and comparable sales from major auction houses
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-low/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="font-semibold">Condition Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed condition analysis affects final valuation accuracy
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
                <span>Analyze Another Artwork</span>
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
