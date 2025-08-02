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

const mockArtworks = [
  {
    title: "Starry Night Study",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas print",
    style: "Post-Impressionism",
    dimensions: "24\" × 30\"",
    baseValue: 15000,
    marketTrend: 'rising' as const,
  },
  {
    title: "Water Lilies Impression", 
    artist: "Claude Monet",
    year: "1919",
    medium: "Lithograph print",
    style: "Impressionism",
    dimensions: "18\" × 24\"",
    baseValue: 8500,
    marketTrend: 'stable' as const,
  },
  {
    title: "The Great Wave",
    artist: "Katsushika Hokusai",
    year: "1831",
    medium: "Woodblock print",
    style: "Ukiyo-e",
    dimensions: "10\" × 15\"",
    baseValue: 3200,
    marketTrend: 'rising' as const,
  },
  {
    title: "Composition with Red Blue and Yellow",
    artist: "Piet Mondrian", 
    year: "1930",
    medium: "Screen print",
    style: "De Stijl",
    dimensions: "20\" × 20\"",
    baseValue: 5500,
    marketTrend: 'stable' as const,
  },
  {
    title: "Campbell's Soup Can",
    artist: "Andy Warhol",
    year: "1962",
    medium: "Silkscreen print",
    style: "Pop Art",
    dimensions: "16\" × 20\"",
    baseValue: 12000,
    marketTrend: 'declining' as const,
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

export const analyzeArtwork = async (imageFile: File): Promise<ArtAnalysisResult> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  
  // Mock analysis - randomly select an artwork and add variations
  const baseArtwork = mockArtworks[Math.floor(Math.random() * mockArtworks.length)];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const conditionMultiplier = conditionMultipliers[condition];
  
  // Add some randomness to the estimates
  const variationFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const baseEstimate = baseArtwork.baseValue * conditionMultiplier * variationFactor;
  
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
      
      const sources = ['Sotheby\'s', 'Christie\'s', 'Phillips', 'Heritage Auctions', 'Bonhams'];
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
    title: baseArtwork.title,
    artist: baseArtwork.artist,
    year: baseArtwork.year,
    medium: baseArtwork.medium,
    condition,
    style: baseArtwork.style,
    dimensions: baseArtwork.dimensions,
    lowEstimate,
    highEstimate,
    marketTrend: baseArtwork.marketTrend,
    confidence: Math.max(40, Math.min(98, confidence)),
    comparableSales: generateComparableSales()
  };
};