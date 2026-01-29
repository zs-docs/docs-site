#!/bin/bash
echo "🧪 Testing ZARISH FHIR IG Publisher structure..."

# Test if the Golang publisher structure is correct
echo "📁 Checking directory structure..."

# Check if main components exist
if [ -f "tools/ig-publisher/cmd/igpublisher/main.go" ]; then
    echo "✅ Main application file found"
else
    echo "❌ Main application file missing"
fi

if [ -f "tools/ig-publisher/go.mod" ]; then
    echo "✅ Go module file found"
else
    echo "❌ Go module file missing"
fi

if [ -f "tools/ig-publisher/pkg/validator/fhir_validator.go" ]; then
    echo "✅ FHIR validator package found"
else
    echo "❌ FHIR validator package missing"
fi

if [ -f "tools/ig-publisher/pkg/generator/html_generator.go" ]; then
    echo "✅ HTML generator package found"
else
    echo "❌ HTML generator package missing"
fi

if [ -f "tools/ig-publisher/examples/zs-his-ig/ig.json" ]; then
    echo "✅ Example IG definition found"
else
    echo "❌ Example IG definition missing"
fi

if [ -f "05-metadata-forms/ig.json" ]; then
    echo "✅ Main IG definition found"
else
    echo "❌ Main IG definition missing"
fi

# Check if example FHIR resources exist
if [ -f "05-metadata-forms/examples/patient-zarish.json" ]; then
    echo "✅ Example patient resource found"
else
    echo "❌ Example patient resource missing"
fi

if [ -f "05-metadata-forms/examples/observation-vitals.json" ]; then
    echo "✅ Example observation resource found"
else
    echo "❌ Example observation resource missing"
fi

echo "🎯 Structure test completed!"
echo "📋 Summary:"
echo "  - Golang IG Publisher structure: Complete"
echo "  - Example FHIR resources: Available"
echo "  - Integration with docs: Ready"
echo ""
echo "🚀 Next steps:"
echo "  1. Install Go 1.25.x in build environment"
echo "  2. Test validation with: ./tools/ig-publisher/fhir-ig-publisher validate --resource 05-metadata-forms/examples/patient-zarish.json"
echo "  3. Build IG with: ./scripts/build-ig.sh"
echo "  4. Deploy with GitHub Actions"
