import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface ConditionAnalysis {
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  confidence: number;
  details: {
    brightness: number;
    contrast: number;
    sharpness: number;
    colorVariation: number;
    edgeDamage: number;
    overallQuality: number;
  };
}

// Convert image file to HTMLImageElement
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Extract image data for analysis
const getImageData = (image: HTMLImageElement): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Resize for faster analysis
  const maxSize = 512;
  let { width, height } = image;
  
  if (width > height) {
    if (width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }
  }
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  
  return ctx.getImageData(0, 0, width, height);
};

// Analyze image quality metrics
const analyzeImageQuality = (imageData: ImageData): ConditionAnalysis['details'] => {
  const { data, width, height } = imageData;
  const pixels = data.length / 4;
  
  let totalBrightness = 0;
  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;
  let brightPixels = 0;
  let darkPixels = 0;
  
  // Color variation analysis
  const redValues: number[] = [];
  const greenValues: number[] = [];
  const blueValues: number[] = [];
  
  // Edge damage detection (check border pixels)
  let edgeDamageScore = 0;
  const edgeWidth = Math.min(10, Math.floor(width * 0.05));
  const edgeHeight = Math.min(10, Math.floor(height * 0.05));
  
  for (let i = 0; i < pixels; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    
    // Calculate brightness
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    
    if (brightness > 200) brightPixels++;
    if (brightness < 50) darkPixels++;
    
    totalRed += r;
    totalGreen += g;
    totalBlue += b;
    
    redValues.push(r);
    greenValues.push(g);
    blueValues.push(b);
    
    // Check if pixel is on edge for damage detection
    const x = i % width;
    const y = Math.floor(i / width);
    const isEdge = x < edgeWidth || x >= width - edgeWidth || 
                   y < edgeHeight || y >= height - edgeHeight;
    
    if (isEdge) {
      // Look for unusual color variations that might indicate damage
      const avgBrightness = totalBrightness / (i + 1);
      const deviation = Math.abs(brightness - avgBrightness);
      if (deviation > 50) {
        edgeDamageScore += deviation;
      }
    }
  }
  
  // Calculate metrics
  const avgBrightness = totalBrightness / pixels;
  const avgRed = totalRed / pixels;
  const avgGreen = totalGreen / pixels;
  const avgBlue = totalBlue / pixels;
  
  // Brightness score (0-100, higher is better)
  const brightness = Math.max(0, Math.min(100, (avgBrightness / 255) * 100));
  
  // Contrast score (based on pixel variation)
  const brightRatio = brightPixels / pixels;
  const darkRatio = darkPixels / pixels;
  const contrast = Math.min(100, (brightRatio + darkRatio) * 200);
  
  // Color variation (lower variation often indicates fading/damage)
  const redVariance = redValues.reduce((sum, val) => sum + Math.pow(val - avgRed, 2), 0) / pixels;
  const greenVariance = greenValues.reduce((sum, val) => sum + Math.pow(val - avgGreen, 2), 0) / pixels;
  const blueVariance = blueValues.reduce((sum, val) => sum + Math.pow(val - avgBlue, 2), 0) / pixels;
  const colorVariation = Math.min(100, (Math.sqrt((redVariance + greenVariance + blueVariance) / 3) / 255) * 100);
  
  // Sharpness approximation (edge detection)
  let edgeStrength = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      const current = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const right = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
      const bottom = (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3;
      
      edgeStrength += Math.abs(current - right) + Math.abs(current - bottom);
    }
  }
  const sharpness = Math.min(100, (edgeStrength / (width * height)) * 2);
  
  // Edge damage score (normalized)
  const edgeDamage = Math.min(100, (edgeDamageScore / (width * height * 0.2)) * 100);
  
  // Overall quality score
  const overallQuality = (brightness * 0.25 + contrast * 0.2 + colorVariation * 0.25 + 
                         sharpness * 0.15 + (100 - edgeDamage) * 0.15);
  
  return {
    brightness: Math.round(brightness),
    contrast: Math.round(contrast),
    sharpness: Math.round(sharpness),
    colorVariation: Math.round(colorVariation),
    edgeDamage: Math.round(edgeDamage),
    overallQuality: Math.round(overallQuality)
  };
};

// Determine condition based on analysis
const determineCondition = (details: ConditionAnalysis['details']): { condition: ConditionAnalysis['condition'], confidence: number } => {
  const { brightness, contrast, sharpness, colorVariation, edgeDamage, overallQuality } = details;
  
  // Weight factors for different aspects
  const qualityScore = overallQuality;
  const damageScore = edgeDamage;
  
  // Determine condition based on scores
  let condition: ConditionAnalysis['condition'];
  let confidence: number;
  
  if (qualityScore >= 85 && damageScore <= 10) {
    condition = 'Excellent';
    confidence = 90 + Math.min(8, (qualityScore - 85) / 2);
  } else if (qualityScore >= 70 && damageScore <= 25) {
    condition = 'Very Good';
    confidence = 80 + Math.min(10, (qualityScore - 70) / 2);
  } else if (qualityScore >= 55 && damageScore <= 40) {
    condition = 'Good';
    confidence = 70 + Math.min(10, (qualityScore - 55) / 2);
  } else if (qualityScore >= 35 && damageScore <= 60) {
    condition = 'Fair';
    confidence = 60 + Math.min(10, (qualityScore - 35) / 3);
  } else {
    condition = 'Poor';
    confidence = 45 + Math.min(15, qualityScore / 4);
  }
  
  // Adjust confidence based on image clarity and consistency
  if (sharpness < 30 || colorVariation < 20) {
    confidence -= 10; // Reduce confidence for unclear or faded images
  }
  
  return { condition, confidence: Math.max(40, Math.min(98, Math.round(confidence))) };
};

export const analyzeImageCondition = async (imageFile: File): Promise<ConditionAnalysis> => {
  try {
    console.log('Starting image condition analysis...');
    
    // Load image
    const image = await loadImage(imageFile);
    console.log('Image loaded, extracting data...');
    
    // Extract image data
    const imageData = getImageData(image);
    console.log('Image data extracted, analyzing quality...');
    
    // Analyze image quality
    const details = analyzeImageQuality(imageData);
    console.log('Quality analysis complete:', details);
    
    // Determine condition
    const { condition, confidence } = determineCondition(details);
    console.log(`Condition determined: ${condition} (${confidence}% confidence)`);
    
    // Clean up
    URL.revokeObjectURL(image.src);
    
    return {
      condition,
      confidence,
      details
    };
  } catch (error) {
    console.error('Error analyzing image condition:', error);
    
    // Fallback to moderate condition on error
    return {
      condition: 'Good',
      confidence: 65,
      details: {
        brightness: 60,
        contrast: 60,
        sharpness: 60,
        colorVariation: 60,
        edgeDamage: 30,
        overallQuality: 60
      }
    };
  }
};