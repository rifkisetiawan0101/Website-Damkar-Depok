<?php
require_once 'db-config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate passwords match
    if ($password !== $confirm_password) {
        echo json_encode(['status' => 'error', 'message' => 'Masukkan Password yang Sama']);
        exit;
    }

    // Check if username exists
    $check_query = "SELECT username FROM table_user WHERE username = '$username'";
    $result = mysqli_query($conn, $check_query);
    
    if (mysqli_num_rows($result) > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username Sudah Ada']);
        exit;
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $query = "INSERT INTO table_user (username, password) VALUES ('$username', '$hashed_password')";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['status' => 'success', 'message' => 'Registration Berhasil!!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Terjadi Kesalahan: ' . mysqli_error($conn)]);
    }
}

mysqli_close($conn);
?>