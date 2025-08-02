import React from 'react';
import { TrendingUp, Info, DollarSign, Star, Calendar, Palette, ExternalLink, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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

interface ValuationResultsProps {
  data: ValuationData;
  imageUrl: string;
}

export const ValuationResults: React.FC<ValuationResultsProps> = ({ data, imageUrl }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-estimate-high text-white';
      case 'Very Good': return 'bg-estimate-medium text-white';
      case 'Good': return 'bg-estimate-medium text-white';
      case 'Fair': return 'bg-estimate-low text-white';
      case 'Poor': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-estimate-high" />;
      case 'stable': return <TrendingUp className="w-4 h-4 text-estimate-medium rotate-90" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-estimate-low rotate-180" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Main Results Header */}
      <Card className="shadow-elegant border-gallery-accent/20">
        <CardHeader className="bg-gradient-gallery border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">Valuation Results</CardTitle>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-gallery-accent" />
              <span className="text-sm font-medium">{data.confidence}% Confidence</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden border border-border">
                <img
                  src={imageUrl}
                  alt="Analyzed poster"
                  className="w-full h-full object-contain bg-gallery-bg"
                />
              </div>
            </div>

            {/* Artwork Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">{data.title}</h2>
                <p className="text-lg text-muted-foreground mb-1">by {data.artist}</p>
                <p className="text-sm text-muted-foreground">{data.year}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-gallery-accent" />
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.medium}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-gallery-accent" />
                    <span className="text-sm font-medium">Style</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.style}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Dimensions</span>
                  <p className="text-sm text-muted-foreground">{data.dimensions}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Condition</span>
                  <Badge className={getConditionColor(data.condition)}>
                    {data.condition}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Estimate */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gallery-accent" />
            <span>Estimated Value Range</span>
            {getTrendIcon(data.marketTrend)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-foreground">
              {formatPrice(data.lowEstimate)} - {formatPrice(data.highEstimate)}
            </div>
            <p className="text-muted-foreground">
              Based on current market conditions and comparable sales
            </p>
            <div className="flex justify-center items-center space-x-2">
              <span className="text-sm">Market Trend:</span>
              <Badge variant="outline" className="capitalize">
                {data.marketTrend}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Where to Sell */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-gallery-accent" />
            <span>Where to Sell Your Poster</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">e</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">eBay</p>
                  <p className="text-xs text-muted-foreground">Largest marketplace for collectors</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">H</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Heritage Auctions</p>
                  <p className="text-xs text-muted-foreground">Premium auction house</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Etsy</p>
                  <p className="text-xs text-muted-foreground">Vintage & collectible posters</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Collectors.com</p>
                  <p className="text-xs text-muted-foreground">Specialized poster community</p>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparable Sales */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gallery-accent" />
            <span>Recent Comparable Sales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.comparableSales.map((sale, index) => (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{formatPrice(sale.price)}</p>
                    <p className="text-sm text-muted-foreground">{sale.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{sale.date}</p>
                  </div>
                </div>
                {index < data.comparableSales.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-muted/50 border-muted">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                This valuation is an estimate based on AI identification and market data. Actual value may vary based on 
                authenticity, condition, rarity, and current market demand. For valuable posters, consider getting a 
                professional appraisal before selling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};