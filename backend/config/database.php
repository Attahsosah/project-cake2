<?php
class Database {
  private $db_path = __DIR__ . "/../database.sqlite";
  public $conn;
  
  public function getConnection() {
    $this->conn = null;
    try {
      $this->conn = new PDO("sqlite:" . $this->db_path);
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      
      // Create users table if it doesn't exist
      $this->conn->exec("
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      ");
      
      // Create recipes table if it doesn't exist
      $this->conn->exec("
        CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          ingredients TEXT NOT NULL,
          instructions TEXT NOT NULL,
          prep_time INTEGER,
          cook_time INTEGER,
          servings INTEGER,
          difficulty TEXT DEFAULT 'medium',
          category TEXT DEFAULT 'other',
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      ");
      
      // Add category column if it doesn't exist (for existing databases)
      try {
        $this->conn->exec("ALTER TABLE recipes ADD COLUMN category TEXT DEFAULT 'other'");
      } catch (PDOException $e) {
        // Column already exists, ignore error
      }
      
    } catch (PDOException $e) { 
      die(json_encode(["db_error" => $e->getMessage()])); 
    }
    return $this->conn;
  }
}