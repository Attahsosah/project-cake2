<?php
// Simple test endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo json_encode([
    'status' => 'ok',
    'message' => 'PHP server is working',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION
]);
?>
