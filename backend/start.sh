#!/bin/bash

echo "Starting PHP server..."
echo "Port: $PORT"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Start PHP server with error reporting
php -S 0.0.0.0:$PORT test.php
