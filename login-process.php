<?php
header('Content-Type: application/json');

session_start();
require_once 'db-config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = mysqli_real_escape_string($conn, $data['username']);
    $password = $data['password'];

    $query = "SELECT id_user, username, password FROM table_user WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);
        
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id_user'];
            $_SESSION['username'] = $user['username'];
            
            echo json_encode([
                'status' => 'success',
                'message' => 'Login Berhasil!!'
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Password Salah']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Username Tidak Ditemukand']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid']);
}

mysqli_close($conn);
?>