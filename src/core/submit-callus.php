<?php
header('Content-Type: application/json');
require_once '../config/db-config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $address = mysqli_real_escape_string($conn, $_POST['address']);
    $message = mysqli_real_escape_string($conn, $_POST['message']);
    $lat = isset($_POST['lat_call']) ? floatval($_POST['lat_call']) : null;
    $lng = isset($_POST['lng_call']) ? floatval($_POST['lng_call']) : null;

    // Handle media file
    $media_path_for_db = null; // Path yang akan disimpan ke DB
    $media_type = null;
    if (isset($_FILES['media_call']) && $_FILES['media_call']['error'] === UPLOAD_ERR_OK) {
        if ($_FILES['media_call']['size'] > 10 * 1024 * 1024) {
            echo json_encode([
                'status' => 'error',
                'message' => 'File terlalu besar. Maksimal ukuran file adalah 10MB'
            ]);
            exit;
        }

        $target_dir_filesystem = "../../public/assets/uploads/";
        $filename = time() . '_' . basename($_FILES["media_call"]["name"]);
        $target_file_filesystem = $target_dir_filesystem . $filename;

        // Cek dan buat direktori jika belum ada
        if (!is_dir($target_dir_filesystem)) {
            mkdir($target_dir_filesystem, 0777, true);
        }

        // Cek dan upload file
        if (move_uploaded_file($_FILES["media_call"]["tmp_name"], $target_file_filesystem)) {
            // Simpan path yang web-accessible ke database
            $media_path_for_db = 'assets/uploads/' . $filename;
            $media_type = $_FILES['media_call']['type'];
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Gagal mengupload file. Cek izin folder.'
            ]);
            exit;
        }
    }

    // Use prepared statement
    $query = "INSERT INTO table_callus (name_call, phone_call, address_call, lat_call, lng_call, message_call, media_call, media_type, created_at, status_call) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'ssddssss', $name, $phone, $address, $lat, $lng, $message, $media_path_for_db, $media_type);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Pesan anda telah terkirim!'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Gagal mengirim pesan: ' . mysqli_stmt_error($stmt)
        ]);
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}

mysqli_close($conn);
?>