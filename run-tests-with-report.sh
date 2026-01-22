#!/bin/bash

# Script to run tests with coverage and open the HTML report
# Usage: ./run-tests-with-report.sh

echo "🧪 Running tests with coverage..."
echo ""

# Run tests with coverage
npm run test:coverage

# Check if tests ran successfully (exit code 0 or 1 are both ok, 1 means some tests failed but coverage was generated)
if [ $? -le 1 ]; then
    echo ""
    echo "✅ Tests completed!"
    echo "📊 Opening coverage report..."
    
    # Wait a moment for the report to be fully written
    sleep 1
    
    # Open the HTML coverage report in default browser
    open coverage/lcov-report/index.html
    
    echo "✨ Coverage report opened in your browser!"
else
    echo ""
    echo "❌ Tests failed to run. Please check the errors above."
    exit 1
fi
