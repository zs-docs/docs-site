#!/bin/bash
set -e

echo "🏗️ Building ZARISH FHIR Implementation Guide..."

# Use the new Golang FHIR IG Publisher
cd tools/ig-publisher

# Build the IG publisher
go build -o fhir-ig-publisher cmd/igpublisher/main.go

# Run the publisher
./fhir-ig-publisher build \
  --source ../05-metadata-forms \
  --output ../output/fhir-ig

echo "✅ ZARISH FHIR IG built successfully!"
echo "📱 Output: ../output/fhir-ig/index.html"
echo "🌐 Open: file://$(pwd)/../output/fhir-ig/index.html"
