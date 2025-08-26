<?php
require_once __DIR__ . "/../config/jwt.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Encode JWT
function createToken($userId) {
    global $key, $iss, $aud, $iat, $nbf;
    $payload = [
        "iss" => $iss,
        "aud" => $aud,
        "iat" => $iat,
        "nbf" => $nbf,
        "data" => [
            "id" => $userId
        ]
    ];
    return JWT::encode($payload, $key, 'HS256');
}

// Decode JWT
function validateToken($jwt) {
    global $key;
    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        return $decoded->data->id;
    } catch (Exception $e) {
        return false;
    }
}
