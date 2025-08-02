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

  const handleImageUpload = async (data: { file: File; width: string; height: string }) => {
    setIsAnalyzing(true);
    const url = URL.createObjectURL(data.file);
    setImageUrl(url);

    try {
      const analysis = await analyzeArtwork(data.file, data.width, data.height);
      setValuationData(analysis);
      
      toast({
        title: "Identification Complete!",
        description: `Your ${analysis.title} has been identified and valued with ${analysis.confidence}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Identification Failed",
        description: "There was an error identifying your poster. Please try again.",
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
                Upload a photo of your poster and get instant AI-powered identification and valuation 
                using online databases, market data, and comparable sales.
              </p>
            </div>
            
            <ArtUploader onImageUpload={handleImageUpload} isAnalyzing={isAnalyzing} />
            
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-high/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="font-semibold">AI Poster Identification</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced image matching searches eBay and online databases for exact matches
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-medium/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time pricing from eBay, auction sites, and poster collector markets
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-estimate-low/20 mx-auto flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="font-semibold">Size & Condition Factors</h3>
                  <p className="text-sm text-muted-foreground">
                    Dimensions and condition analysis for precise market valuation
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
