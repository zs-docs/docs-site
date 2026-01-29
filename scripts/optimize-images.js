#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Image Optimization Script for ZARISH SPHERE Documentation
 *
 * This script provides image optimization recommendations and analysis
 * for the documentation site. Since we don't have access to ImageMagick,
 * it provides detailed analysis and recommendations for manual optimization.
 */

class ImageOptimizer {
  constructor() {
    this.staticDir = path.join(__dirname, '../static');
    this.imgDir = path.join(this.staticDir, 'img');
    this.recommendations = [];
  }

  /**
   * Analyze all images in the static directory
   */
  analyzeImages() {
    console.log('🖼️  Analyzing images for optimization opportunities...\n');

    if (!fs.existsSync(this.imgDir)) {
      console.log('❌ Image directory not found');
      return;
    }

    const images = this.getAllImages();

    if (images.length === 0) {
      console.log('ℹ️  No images found to optimize');
      return;
    }

    console.log(`📁 Found ${images.length} images\n`);

    let totalSize = 0;
    let largeImages = [];
    let unoptimizedImages = [];

    images.forEach((image) => {
      const stats = fs.statSync(image.path);
      const sizeInMB = stats.size / (1024 * 1024);
      totalSize += sizeInMB;

      // Check for large images (> 500KB)
      if (sizeInMB > 0.5) {
        largeImages.push({
          ...image,
          size: sizeInMB,
          recommendation: this.getOptimizationRecommendation(image, sizeInMB),
        });
      }

      // Check for unoptimized formats
      if (this.isUnoptimized(image)) {
        unoptimizedImages.push({
          ...image,
          size: sizeInMB,
          recommendation: this.getFormatRecommendation(image),
        });
      }
    });

    this.printAnalysis(totalSize, images.length, largeImages, unoptimizedImages);
    this.generateOptimizationScript(largeImages, unoptimizedImages);
  }

  /**
   * Get all image files from the static directory
   */
  getAllImages() {
    const images = [];
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);

      items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else {
          const ext = path.extname(item).toLowerCase();
          if (extensions.includes(ext)) {
            images.push({
              name: item,
              path: fullPath,
              extension: ext,
              relativePath: path.relative(this.staticDir, fullPath),
            });
          }
        }
      });
    };

    scanDirectory(this.staticDir);
    return images;
  }

  /**
   * Check if image format is unoptimized
   */
  isUnoptimized(image) {
    // PNG files that could be WebP
    if (image.extension === '.png') {
      return true;
    }

    // JPEG files that could be optimized
    if (image.extension === '.jpg' || image.extension === '.jpeg') {
      return true;
    }

    return false;
  }

  /**
   * Get optimization recommendation for large images
   */
  getOptimizationRecommendation(image, sizeInMB) {
    const recommendations = [];

    if (sizeInMB > 2) {
      recommendations.push('Consider resizing to maximum width of 1200px for web');
      recommendations.push('Use progressive JPEG for photos');
      recommendations.push('Consider using WebP format for better compression');
    } else if (sizeInMB > 1) {
      recommendations.push('Consider compressing with quality 85-90%');
      recommendations.push('Evaluate if smaller dimensions would work');
    } else if (sizeInMB > 0.5) {
      recommendations.push('Light compression recommended');
      recommendations.push('Consider WebP format for modern browsers');
    }

    return recommendations;
  }

  /**
   * Get format recommendation
   */
  getFormatRecommendation(image) {
    if (image.extension === '.png') {
      return [
        'Convert to WebP for 25-35% size reduction',
        'If transparency not needed, consider JPEG',
        'Use PNG-8 for simple graphics with limited colors',
      ];
    }

    if (image.extension === '.jpg' || image.extension === '.jpeg') {
      return [
        'Convert to WebP for 25-35% size reduction',
        'Use progressive JPEG for better loading experience',
        'Consider quality 85% for good balance',
      ];
    }

    return [];
  }

  /**
   * Print analysis results
   */
  printAnalysis(totalSize, imageCount, largeImages, unoptimizedImages) {
    console.log('📊 IMAGE ANALYSIS RESULTS');
    console.log('='.repeat(50));
    console.log(`Total images: ${imageCount}`);
    console.log(`Total size: ${totalSize.toFixed(2)} MB`);
    console.log(`Average size: ${(totalSize / imageCount).toFixed(2)} MB\n`);

    if (largeImages.length > 0) {
      console.log('⚠️  LARGE IMAGES (> 500KB):');
      largeImages.forEach((img) => {
        console.log(`   📁 ${img.relativePath} (${img.size.toFixed(2)} MB)`);
        img.recommendation.forEach((rec) => {
          console.log(`      💡 ${rec}`);
        });
        console.log('');
      });
    }

    if (unoptimizedImages.length > 0) {
      console.log('🔄 FORMAT OPTIMIZATION OPPORTUNITIES:');
      unoptimizedImages.forEach((img) => {
        console.log(`   📁 ${img.relativePath} (${img.size.toFixed(2)} MB)`);
        img.recommendation.forEach((rec) => {
          console.log(`      💡 ${rec}`);
        });
        console.log('');
      });
    }

    if (largeImages.length === 0 && unoptimizedImages.length === 0) {
      console.log('✅ All images are well optimized!');
    }
  }

  /**
   * Generate optimization script for manual execution
   */
  generateOptimizationScript(largeImages, unoptimizedImages) {
    const script = [];
    script.push('#!/bin/bash');
    script.push('# Image Optimization Script for ZARISH SPHERE');
    script.push('# Generated automatically - review before executing');
    script.push('');
    script.push('echo "🖼️  Starting image optimization..."');
    script.push('');

    if (largeImages.length > 0) {
      script.push('# Large Image Optimizations');
      largeImages.forEach((img) => {
        const baseName = path.basename(img.path, path.extname(img.path));
        const ext = path.extname(img.path);

        if (ext === '.png') {
          script.push(`# Optimize ${img.relativePath}`);
          script.push(`# convert "${img.path}" -resize 1200x1200\\> -quality 85 "${img.path}"`);
          script.push(`# cwebp -q 80 "${img.path}" -o "${img.path.replace(ext, '.webp')}"`);
        } else if (ext === '.jpg' || ext === '.jpeg') {
          script.push(`# Optimize ${img.relativePath}`);
          script.push(
            `# convert "${img.path}" -resize 1200x1200\\> -quality 85 -interlace Plane "${img.path}"`
          );
          script.push(`# cwebp -q 80 "${img.path}" -o "${img.path.replace(ext, '.webp')}"`);
        }
        script.push('');
      });
    }

    if (unoptimizedImages.length > 0) {
      script.push('# Format Conversions');
      unoptimizedImages.forEach((img) => {
        const ext = path.extname(img.path);
        const webpPath = img.path.replace(ext, '.webp');

        script.push(`# Convert ${img.relativePath} to WebP`);
        script.push(`# cwebp -q 80 "${img.path}" -o "${webpPath}"`);
        script.push('');
      });
    }

    script.push('echo "✅ Image optimization complete!"');
    script.push('');
    script.push('# Update references in markdown files');
    script.push('# find . -name "*.md" -exec sed -i "s/\\.png/.webp/g" {} \\;');
    script.push('# find . -name "*.md" -exec sed -i "s/\\.jpg/.webp/g" {} \\;');
    script.push('# find . -name "*.md" -exec sed -i "s/\\.jpeg/.webp/g" {} \\;');

    const scriptPath = path.join(__dirname, '../optimize-images-manual.sh');
    fs.writeFileSync(scriptPath, script.join('\n'));

    console.log(`📝 Optimization script generated: ${scriptPath}`);
    console.log('💡 Review and execute the script manually to optimize images');
  }
}

// Main execution
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  optimizer.analyzeImages();
}

module.exports = ImageOptimizer;
