<?php
// Simple PHP development server
// Run with: php server.php

$host = 'localhost';
$port = 8000;

echo "Starting PHP development server on http://{$host}:{$port}" . PHP_EOL;
echo "Press Ctrl+C to stop the server" . PHP_EOL;

// Start the built-in PHP server
passthru("php -S {$host}:{$port} -t .");
