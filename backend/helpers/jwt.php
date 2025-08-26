<?php
$key = "supersecretkey123";  // replace with env variable in production
$iss = "http://localhost";  // issuer
$aud = "http://localhost";  // audience
$iat = time();               // issued at
$nbf = $iat;                 // not before
