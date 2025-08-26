<?php
class Database {
    private $host = "localhost";      // Change if needed
    private $db_name = "project_cake";
    private $username = "root";       // Change if needed
    private $password = "";           // Change if needed
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8mb4");
        } catch (PDOException $exception) {
            echo "Database connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
