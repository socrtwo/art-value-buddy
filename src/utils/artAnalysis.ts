// Mock art analysis function - in a real app, this would integrate with computer vision APIs
// and art market databases

interface ArtAnalysisResult {
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

const mockPosters = [
  {
    title: "Star Wars: A New Hope",
    artist: "Tom Jung",
    year: "1977",
    medium: "Original theatrical poster",
    style: "Movie Poster",
    baseValue: 850,
    marketTrend: 'rising' as const,
  },
  {
    title: "Pink Floyd - The Wall", 
    artist: "Gerald Scarfe",
    year: "1979",
    medium: "Concert poster",
    style: "Rock Poster",
    baseValue: 325,
    marketTrend: 'stable' as const,
  },
  {
    title: "Jaws",
    artist: "Roger Kastel",
    year: "1975",
    medium: "Original movie poster",
    style: "Movie Poster",
    baseValue: 1200,
    marketTrend: 'rising' as const,
  },
  {
    title: "The Beatles - Abbey Road",
    artist: "Apple Records",
    year: "1969",
    medium: "Promotional poster",
    style: "Music Poster",
    baseValue: 450,
    marketTrend: 'stable' as const,
  },
  {
    title: "Pulp Fiction",
    artist: "James Verdesoto",
    year: "1994",
    medium: "Theatrical poster",
    style: "Movie Poster",
    baseValue: 275,
    marketTrend: 'rising' as const,
  },
  {
    title: "Woodstock Festival",
    artist: "Arnold Skolnick",
    year: "1969",
    medium: "Event poster",
    style: "Concert Poster",
    baseValue: 1800,
    marketTrend: 'rising' as const,
  }
];

const conditions: Array<'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor'> = 
  ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];

const conditionMultipliers = {
  'Excellent': 1.0,
  'Very Good': 0.85,
  'Good': 0.7,
  'Fair': 0.45,
  'Poor': 0.2
};

export const analyzeArtwork = async (imageFile: File, width: string, height: string): Promise<ArtAnalysisResult> => {
  // Simulate AI processing time for online identification
  await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000));
  
  // Mock analysis - randomly select a poster and add variations
  const basePoster = mockPosters[Math.floor(Math.random() * mockPosters.length)];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const conditionMultiplier = conditionMultipliers[condition];
  
  // Calculate size multiplier based on dimensions
  const widthNum = parseInt(width) || 24;
  const heightNum = parseInt(height) || 36;
  const area = widthNum * heightNum;
  const sizeMultiplier = area > 500 ? 1.2 : area < 200 ? 0.8 : 1.0;
  
  // Add some randomness to the estimates
  const variationFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const baseEstimate = basePoster.baseValue * conditionMultiplier * sizeMultiplier * variationFactor;
  
  const lowEstimate = Math.round(baseEstimate * 0.8);
  const highEstimate = Math.round(baseEstimate * 1.3);
  
  // Generate confidence based on condition and random factors
  const confidence = Math.round(
    (condition === 'Excellent' ? 95 : 
     condition === 'Very Good' ? 88 :
     condition === 'Good' ? 75 :
     condition === 'Fair' ? 65 : 45) + 
    (Math.random() * 10 - 5)
  );

  // Generate comparable sales
  const generateComparableSales = () => {
    const sales = [];
    for (let i = 0; i < 3; i++) {
      const salePrice = Math.round(baseEstimate * (0.7 + Math.random() * 0.6));
      const monthsAgo = Math.floor(Math.random() * 24) + 1;
      const date = new Date();
      date.setMonth(date.getMonth() - monthsAgo);
      
      const sources = ['eBay', 'Heritage Auctions', 'MoviePosterShop', 'Collectors.com', 'RockPosters.com'];
      const source = sources[Math.floor(Math.random() * sources.length)];
      
      sales.push({
        price: salePrice,
        date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        source: source
      });
    }
    return sales.sort((a, b) => b.price - a.price);
  };

  return {
    title: basePoster.title,
    artist: basePoster.artist,
    year: basePoster.year,
    medium: basePoster.medium,
    condition,
    style: basePoster.style,
    dimensions: `${width}" × ${height}"`,
    lowEstimate,
    highEstimate,
    marketTrend: basePoster.marketTrend,
    confidence: Math.max(40, Math.min(98, confidence)),
    comparableSales: generateComparableSales()
  };
};