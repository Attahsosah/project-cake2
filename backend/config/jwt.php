<?php
$key = 'CHANGE_THIS_TO_A_LONG_RANDOM_SECRET';
$algo = 'HS256';
$ttl = 3600;
$iss = 'project-cake-api';
$aud = 'project-cake-frontend';
$iat = time();
$nbf = $iat;
