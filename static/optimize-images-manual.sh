#!/bin/bash
# Image Optimization Script for ZARISH SPHERE
# Generated automatically - review before executing

echo "🖼️  Starting image optimization..."

# Large Image Optimizations
# Optimize img/zs-docs-banner.png
# convert "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs-banner.png" -resize 1200x1200\> -quality 85 "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs-banner.png"
# cwebp -q 80 "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs-banner.png" -o "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs-banner.webp"

# Format Conversions
# Convert img/zs-docs-banner.png to WebP
# cwebp -q 80 "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs-banner.png" -o "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs-banner.webp"

# Convert img/zs-docs.png to WebP
# cwebp -q 80 "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs.png" -o "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-docs.webp"

# Convert img/zs-health.png to WebP
# cwebp -q 80 "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-health.png" -o "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-health.webp"

# Convert img/zs-platform.png to WebP
# cwebp -q 80 "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-platform.png" -o "/home/ariful/Desktop/zs-docs/docs-site/static/img/zs-platform.webp"

echo "✅ Image optimization complete!"

# Update references in markdown files
# find . -name "*.md" -exec sed -i "s/\.png/.webp/g" {} \;
# find . -name "*.md" -exec sed -i "s/\.jpg/.webp/g" {} \;
# find . -name "*.md" -exec sed -i "s/\.jpeg/.webp/g" {} \;