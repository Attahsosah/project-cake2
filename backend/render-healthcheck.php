<?php
// Render healthcheck endpoint
http_response_code(200);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'healthy',
    'service' => 'cake-backend-api',
    'timestamp' => date('c'),
    'php_version' => PHP_VERSION
]);
?>
