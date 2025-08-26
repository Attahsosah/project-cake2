#!/bin/bash
set -e

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "Changing to frontend directory..."
cd frontend

echo "Installing dependencies..."
npm install

echo "Building Next.js app..."
npm run build

echo "Build completed successfully!"
