#!/bin/bash
echo "🧪 Testing ZARISH FHIR IG Publisher structure..."

# Test if the submodule is properly integrated
if [ -d "tools/ig-publisher" ]; then
    echo "✅ IG Publisher submodule found"
else
    echo "❌ IG Publisher submodule missing"
    exit 1
fi

# Test if the main.go file exists
if [ -f "tools/ig-publisher/cmd/igpublisher/main.go" ]; then
    echo "✅ Main application file found"
else
    echo "❌ Main application file missing"
    exit 1
fi

# Test if go.mod exists
if [ -f "tools/ig-publisher/go.mod" ]; then
    echo "✅ Go module file found"
else
    echo "❌ Go module file missing"
    exit 1
fi

# Test if examples exist
if [ -f "05-metadata-forms/ig.json" ]; then
    echo "✅ IG definition file found"
else
    echo "❌ IG definition file missing"
    exit 1
fi

echo "🎯 Structure test completed successfully!"
echo "📦 Ready for Go build when Go is available"
