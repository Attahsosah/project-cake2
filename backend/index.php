<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/helpers/cors.php';
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/auth.php';
require_once __DIR__ . '/config/database.php';

// Get the request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove /api prefix if present
$path = str_replace('/api', '', $path);

// Route the request
switch ($path) {
    case '/':
        // Healthcheck endpoint - no database connection required
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET');
        header('Access-Control-Allow-Headers: Content-Type');
        echo json_encode(['status' => 'ok', 'message' => 'Cake API Backend is running', 'timestamp' => date('Y-m-d H:i:s')]);
        exit;
        break;
        
    case '/register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handleRegister();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handleLogin();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/recipes':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            handleGetRecipes();
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handleCreateRecipe();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/my-recipes':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            handleGetMyRecipes();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/admin/users':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            handleGetAllUsers();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/categories':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            handleGetCategories();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/upload-image':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handleImageUpload();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    case '/recipes/sample':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            handleCreateSampleRecipes();
        } else {
            sendResponse(405, 'Method not allowed');
        }
        break;
        
    default:
        sendResponse(404, 'Endpoint not found');
        break;
}

function handleRegister() {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendResponse(400, 'Invalid JSON input');
    }
    
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    // Validate input
    if (empty($username) || empty($email) || empty($password)) {
        sendResponse(400, 'Username, email, and password are required');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(400, 'Invalid email format');
    }
    
    if (strlen($password) < 6) {
        sendResponse(400, 'Password must be at least 6 characters long');
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Check if user already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        
        if ($stmt->fetch()) {
            sendResponse(409, 'User with this email or username already exists');
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword]);
        
        sendResponse(201, 'User registered successfully', ['success' => true]);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleLogin() {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendResponse(400, 'Invalid JSON input');
    }
    
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    // Validate input
    if (empty($email) || empty($password)) {
        sendResponse(400, 'Email and password are required');
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Find user by email
        $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user || !password_verify($password, $user['password'])) {
            sendResponse(401, 'Invalid email or password');
        }
        
        // Generate JWT token
        $token = createToken($user['id']);
        
        // Return user data and token
        unset($user['password']); // Don't send password back
        sendResponse(200, 'Login successful', [
            'token' => $token,
            'user' => $user
        ]);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleGetRecipes() {
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Get query parameters
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? '';
        
        // Build the query
        $query = "
            SELECT r.*, u.username as author 
            FROM recipes r 
            JOIN users u ON r.user_id = u.id 
            WHERE 1=1
        ";
        $params = [];
        
        // Add search filter
        if (!empty($search)) {
            $query .= " AND (r.title LIKE ? OR r.description LIKE ? OR r.ingredients LIKE ?)";
            $searchParam = "%$search%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        // Add category filter
        if (!empty($category) && $category !== 'all') {
            $query .= " AND r.category = ?";
            $params[] = $category;
        }
        
        $query .= " ORDER BY r.created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse(200, 'Recipes retrieved successfully', $recipes);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleGetMyRecipes() {
    try {
        // Get user ID from JWT token
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';
        
        if (empty($token)) {
            sendResponse(401, 'No authorization token provided');
        }
        
        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);
        
        // Verify token and get user ID
        $userId = validateToken($token);
        if (!$userId) {
            sendResponse(401, 'Invalid or expired token');
        }
        
        $db = new Database();
        $conn = $db->getConnection();
        
        // Get query parameters
        $search = $_GET['search'] ?? '';
        $category = $_GET['category'] ?? '';
        
        // Build the query
        $query = "
            SELECT r.*, u.username as author 
            FROM recipes r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.user_id = ?
        ";
        $params = [$userId];
        
        // Add search filter
        if (!empty($search)) {
            $query .= " AND (r.title LIKE ? OR r.description LIKE ? OR r.ingredients LIKE ?)";
            $searchParam = "%$search%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        // Add category filter
        if (!empty($category) && $category !== 'all') {
            $query .= " AND r.category = ?";
            $params[] = $category;
        }
        
        $query .= " ORDER BY r.created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendResponse(200, 'My recipes retrieved successfully', $recipes);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleGetAllUsers() {
    try {
        // Get user ID from JWT token
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';
        
        if (empty($token)) {
            sendResponse(401, 'No authorization token provided');
        }
        
        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);
        
        // Verify token and get user ID
        $userId = validateToken($token);
        if (!$userId) {
            sendResponse(401, 'Invalid or expired token');
        }
        
        $db = new Database();
        $conn = $db->getConnection();
        
        // Check if user has admin privileges
        $stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$userData || $userData['email'] !== 'sosahattah55@gmail.com') {
            sendResponse(403, 'Access denied. Admin privileges required.');
        }
        
        // Get all users (excluding passwords for security)
        $stmt = $conn->prepare("
            SELECT id, username, email, created_at 
            FROM users 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get some basic stats
        $stmt = $conn->prepare("SELECT COUNT(*) as total_users FROM users");
        $stmt->execute();
        $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total_users'];
        
        $stmt = $conn->prepare("SELECT COUNT(*) as total_recipes FROM recipes");
        $stmt->execute();
        $totalRecipes = $stmt->fetch(PDO::FETCH_ASSOC)['total_recipes'];
        
        sendResponse(200, 'Users retrieved successfully', [
            'users' => $users,
            'stats' => [
                'total_users' => $totalUsers,
                'total_recipes' => $totalRecipes
            ]
        ]);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleGetCategories() {
    try {
        $categories = [
            [
                'id' => 'chocolate',
                'name' => 'Chocolate Cakes',
                'emoji' => '🍫',
                'description' => 'Rich and decadent chocolate cakes'
            ],
            [
                'id' => 'vanilla',
                'name' => 'Vanilla & Classic',
                'emoji' => '🍰',
                'description' => 'Traditional and classic cakes'
            ],
            [
                'id' => 'fruit',
                'name' => 'Fruit Cakes',
                'emoji' => '🍓',
                'description' => 'Fresh and fruity cakes'
            ],
            [
                'id' => 'cheesecake',
                'name' => 'Cheesecakes',
                'emoji' => '🧀',
                'description' => 'Creamy and smooth cheesecakes'
            ],
            [
                'id' => 'layer',
                'name' => 'Layer Cakes',
                'emoji' => '🎂',
                'description' => 'Multi-layered and fancy cakes'
            ],
            [
                'id' => 'specialty',
                'name' => 'Specialty Cakes',
                'emoji' => '⭐',
                'description' => 'Unique and special cakes'
            ],
            [
                'id' => 'cupcakes',
                'name' => 'Cupcakes',
                'emoji' => '🧁',
                'description' => 'Individual sized cakes'
            ],
            [
                'id' => 'mousse',
                'name' => 'Mousse Cakes',
                'emoji' => '☁️',
                'description' => 'Light and airy mousse cakes'
            ],
            [
                'id' => 'international',
                'name' => 'International',
                'emoji' => '🌍',
                'description' => 'Cakes from around the world'
            ],
            [
                'id' => 'seasonal',
                'name' => 'Seasonal & Holiday',
                'emoji' => '🎄',
                'description' => 'Holiday and seasonal cakes'
            ],
            [
                'id' => 'pies',
                'name' => 'Pies & Tarts',
                'emoji' => '🥧',
                'description' => 'Delicious pies and tarts'
            ],
            [
                'id' => 'other',
                'name' => 'Other',
                'emoji' => '🍪',
                'description' => 'Other delicious desserts'
            ]
        ];
        
        sendResponse(200, 'Categories retrieved successfully', $categories);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleCreateRecipe() {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendResponse(400, 'Invalid JSON input');
    }
    
    $title = $input['title'] ?? '';
    $description = $input['description'] ?? '';
    $ingredients = $input['ingredients'] ?? '';
    $instructions = $input['instructions'] ?? '';
    $prep_time = $input['prep_time'] ?? 0;
    $cook_time = $input['cook_time'] ?? 0;
    $servings = $input['servings'] ?? 1;
    $difficulty = $input['difficulty'] ?? 'medium';
    $category = $input['category'] ?? 'other';
    $image_url = $input['image_url'] ?? '';
    
    // Validate input
    if (empty($title) || empty($ingredients) || empty($instructions)) {
        sendResponse(400, 'Title, ingredients, and instructions are required');
    }
    
    try {
        // Get user ID from JWT token
        $headers = getallheaders();
        $token = $headers['Authorization'] ?? '';
        
        if (empty($token)) {
            sendResponse(401, 'No authorization token provided');
        }
        
        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $token);
        
        // Verify token and get user ID
        $userId = validateToken($token);
        if (!$userId) {
            sendResponse(401, 'Invalid or expired token');
        }
        
        $db = new Database();
        $conn = $db->getConnection();
        
        // Insert new recipe
        $stmt = $conn->prepare("
            INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $title, $description, $ingredients, $instructions, $prep_time, $cook_time, $servings, $difficulty, $category, $image_url]);
        
        sendResponse(201, 'Recipe created successfully', ['success' => true]);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}

function handleImageUpload() {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        sendResponse(400, 'No image file uploaded or upload error');
    }
    
    $file = $_FILES['image'];
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        sendResponse(400, 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
    }
    
    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        sendResponse(400, 'File too large. Maximum size is 5MB');
    }
    
    // Create uploads directory if it doesn't exist
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Return the URL to the uploaded image
        $imageUrl = 'http://localhost:8000/uploads/' . $filename;
        sendResponse(200, 'Image uploaded successfully', [
            'url' => $imageUrl,
            'filename' => $filename
        ]);
    } else {
        sendResponse(500, 'Failed to save uploaded file');
    }
}

function handleCreateSampleRecipes() {
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        // Sample recipes data
        $sampleRecipes = [
            [
                'title' => 'Chocolate Lava Cake',
                'description' => 'A decadent chocolate cake with a molten center that oozes when you cut into it.',
                'ingredients' => json_encode([
                    '1/2 cup unsalted butter',
                    '4 oz dark chocolate (70% cocoa)',
                    '2 large eggs',
                    '2 large egg yolks',
                    '1/4 cup granulated sugar',
                    '1/4 cup all-purpose flour',
                    '1/4 tsp salt',
                    '1 tsp vanilla extract'
                ]),
                'instructions' => json_encode([
                    'Preheat oven to 425°F (220°C). Grease 4 ramekins with butter.',
                    'Melt butter and chocolate together in a double boiler until smooth.',
                    'In a separate bowl, whisk eggs, egg yolks, and sugar until pale and fluffy.',
                    'Fold the chocolate mixture into the egg mixture.',
                    'Gently fold in flour and salt until just combined.',
                    'Divide batter among ramekins and bake for 12-14 minutes.',
                    'Let cool for 1 minute, then invert onto plates and serve immediately.'
                ]),
                'prep_time' => 15,
                'cook_time' => 14,
                'servings' => 4,
                'difficulty' => 'medium',
                'category' => 'chocolate',
                'image_url' => 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500'
            ],
            [
                'title' => 'Classic Vanilla Cupcakes',
                'description' => 'Light and fluffy vanilla cupcakes with a perfect crumb and sweet vanilla flavor.',
                'ingredients' => json_encode([
                    '1 1/2 cups all-purpose flour',
                    '1 1/2 tsp baking powder',
                    '1/4 tsp salt',
                    '1/2 cup unsalted butter, softened',
                    '1 cup granulated sugar',
                    '2 large eggs',
                    '1 tsp vanilla extract',
                    '1/2 cup whole milk'
                ]),
                'instructions' => json_encode([
                    'Preheat oven to 350°F (175°C). Line a muffin tin with cupcake liners.',
                    'Whisk together flour, baking powder, and salt in a medium bowl.',
                    'In a large bowl, cream butter and sugar until light and fluffy.',
                    'Add eggs one at a time, beating well after each addition.',
                    'Mix in vanilla extract.',
                    'Alternate adding flour mixture and milk, beginning and ending with flour.',
                    'Fill cupcake liners 2/3 full and bake for 18-20 minutes.',
                    'Cool completely before frosting.'
                ]),
                'prep_time' => 20,
                'cook_time' => 20,
                'servings' => 12,
                'difficulty' => 'easy',
                'category' => 'cupcakes',
                'image_url' => 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500'
            ],
            [
                'title' => 'Red Velvet Cake',
                'description' => 'A Southern classic with its signature red color and cream cheese frosting.',
                'ingredients' => json_encode([
                    '2 1/2 cups all-purpose flour',
                    '1 1/2 cups granulated sugar',
                    '1 tsp baking soda',
                    '1 tsp salt',
                    '1 tsp cocoa powder',
                    '1 1/2 cups vegetable oil',
                    '1 cup buttermilk',
                    '2 large eggs',
                    '2 tbsp red food coloring',
                    '1 tsp vanilla extract',
                    '1 tsp white vinegar'
                ]),
                'instructions' => json_encode([
                    'Preheat oven to 350°F (175°C). Grease and flour two 9-inch round cake pans.',
                    'Whisk together flour, sugar, baking soda, salt, and cocoa powder.',
                    'In a separate bowl, mix oil, buttermilk, eggs, food coloring, vanilla, and vinegar.',
                    'Add wet ingredients to dry ingredients and mix until just combined.',
                    'Divide batter between prepared pans and bake for 25-30 minutes.',
                    'Cool in pans for 10 minutes, then transfer to wire racks.',
                    'Frost with cream cheese frosting when completely cool.'
                ]),
                'prep_time' => 25,
                'cook_time' => 30,
                'servings' => 12,
                'difficulty' => 'layer',
                'category' => 'layer',
                'image_url' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
            ],
            [
                'title' => 'Tiramisu',
                'description' => 'An Italian dessert with layers of coffee-soaked ladyfingers and creamy mascarpone filling.',
                'ingredients' => json_encode([
                    '6 large egg yolks',
                    '1 cup granulated sugar',
                    '1 1/4 cups mascarpone cheese',
                    '1 3/4 cups heavy whipping cream',
                    '2 packages ladyfinger cookies',
                    '1 cup strong brewed coffee, cooled',
                    '2 tbsp coffee liqueur (optional)',
                    'Unsweetened cocoa powder for dusting'
                ]),
                'instructions' => json_encode([
                    'In a heatproof bowl, whisk egg yolks and sugar over simmering water until pale and thick.',
                    'Remove from heat and whisk in mascarpone until smooth.',
                    'In a separate bowl, whip cream to stiff peaks.',
                    'Fold whipped cream into mascarpone mixture.',
                    'Mix coffee and liqueur in a shallow dish.',
                    'Quickly dip each ladyfinger in coffee mixture and arrange in a 9x13 dish.',
                    'Spread half the mascarpone mixture over ladyfingers.',
                    'Repeat with another layer of ladyfingers and remaining mascarpone mixture.',
                    'Cover and refrigerate for at least 4 hours or overnight.',
                    'Dust with cocoa powder before serving.'
                ]),
                'prep_time' => 30,
                'cook_time' => 0,
                'servings' => 12,
                'difficulty' => 'hard',
                'category' => 'international',
                'image_url' => 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'
            ],
            [
                'title' => 'Lemon Blueberry Cheesecake',
                'description' => 'A refreshing cheesecake with bright lemon flavor and fresh blueberries.',
                'ingredients' => json_encode([
                    '1 1/2 cups graham cracker crumbs',
                    '1/4 cup granulated sugar',
                    '1/3 cup melted butter',
                    '3 (8 oz) packages cream cheese, softened',
                    '1 cup granulated sugar',
                    '3 large eggs',
                    '1/4 cup fresh lemon juice',
                    '1 tbsp lemon zest',
                    '1 tsp vanilla extract',
                    '1 cup fresh blueberries',
                    '1/4 cup blueberry jam'
                ]),
                'instructions' => json_encode([
                    'Preheat oven to 325°F (165°C). Wrap a 9-inch springform pan with foil.',
                    'Mix graham cracker crumbs, sugar, and melted butter. Press into pan bottom.',
                    'Bake crust for 10 minutes, then cool.',
                    'Beat cream cheese and sugar until smooth.',
                    'Add eggs one at a time, then lemon juice, zest, and vanilla.',
                    'Pour filling over crust and bake for 45-50 minutes.',
                    'Cool completely, then refrigerate for at least 4 hours.',
                    'Top with fresh blueberries and warmed blueberry jam before serving.'
                ]),
                'prep_time' => 30,
                'cook_time' => 50,
                'servings' => 12,
                'difficulty' => 'medium',
                'category' => 'cheesecake',
                'image_url' => 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500'
            ]
        ];
        
        // Insert sample recipes
        $stmt = $conn->prepare("
            INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        foreach ($sampleRecipes as $recipe) {
            $stmt->execute([1, $recipe['title'], $recipe['description'], $recipe['ingredients'], $recipe['instructions'], $recipe['prep_time'], $recipe['cook_time'], $recipe['servings'], $recipe['difficulty'], $recipe['category'], $recipe['image_url']]);
        }
        
        sendResponse(201, 'Sample recipes created successfully', ['count' => count($sampleRecipes)]);
        
    } catch (Exception $e) {
        sendResponse(500, 'Database error: ' . $e->getMessage());
    }
}
