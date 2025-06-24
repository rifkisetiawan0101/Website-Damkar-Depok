<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once 'db-config.php';

// Check if action is set
if (!isset($_POST['action'])) {
    echo json_encode(['status' => 'error', 'message' => 'No action specified']);
    exit;
}

$action = $_POST['action'];
$table = $_POST['table'];
$response = ['status' => 'error', 'message' => 'Invalid action'];

switch($action) {
    case 'add':
        switch($table) {
            case 'locations':
                $name = mysqli_real_escape_string($conn, $_POST['name_location']);
                $lat = floatval($_POST['lat_location']);
                $long = floatval($_POST['long_location']);
                
                $query = "INSERT INTO table_locations (name_location, lat_location, long_location) 
                            VALUES ('$name', $lat, $long)";
                if (mysqli_query($conn, $query)) {
                    $response = ['status' => 'success'];
                } else {
                    $response = ['status' => 'error', 'message' => mysqli_error($conn)];
                }
                break;

            case 'events':
                $name = mysqli_real_escape_string($conn, $_POST['name_event']);
                $date = mysqli_real_escape_string($conn, $_POST['date_event']);
                $desc = mysqli_real_escape_string($conn, $_POST['desc_event']);
                
                $imageData = null;
                if (isset($_FILES['image_event']) && $_FILES['image_event']['size'] > 0) {
                    $imageData = addslashes(file_get_contents($_FILES['image_event']['tmp_name']));
                }
                
                $query = "INSERT INTO table_event (name_event, date_event, desc_event, image_event) 
                            VALUES ('$name', '$date', '$desc', '$imageData')";
                if (mysqli_query($conn, $query)) {
                    $response = ['status' => 'success'];
                } else {
                    $response = ['status' => 'error', 'message' => mysqli_error($conn)];
                }
                break;

            case 'education':
                $name = mysqli_real_escape_string($conn, $_POST['name_education']);
                $desc = mysqli_real_escape_string($conn, $_POST['desc_education']);
                
                $imageData = null;
                if (isset($_FILES['image_education']) && $_FILES['image_education']['size'] > 0) {
                    $imageData = addslashes(file_get_contents($_FILES['image_education']['tmp_name']));
                }
                
                $query = "INSERT INTO table_education (name_education, desc_education, image_education) 
                            VALUES ('$name', '$desc', '$imageData')";
                if (mysqli_query($conn, $query)) {
                    $response = ['status' => 'success'];
                } else {
                    $response = ['status' => 'error', 'message' => mysqli_error($conn)];
                }
                break;
        }
        break;

    case 'update':
        switch($table) {
            case 'update-locations':
                $id = intval($_POST['id_location']);
                $name = mysqli_real_escape_string($conn, $_POST['name_location']);
                $lat = floatval($_POST['lat_location']);
                $long = floatval($_POST['long_location']);
                
                $query = "UPDATE table_locations 
                            SET name_location='$name', lat_location=$lat, long_location=$long 
                            WHERE id_location=$id";
                break;
                
            case 'update-events':
                $id = intval($_POST['id_event']);
                $name = mysqli_real_escape_string($conn, $_POST['name_event']);
                $date = mysqli_real_escape_string($conn, $_POST['date_event']);
                $desc = mysqli_real_escape_string($conn, $_POST['desc_event']);
                
                $query = "UPDATE table_event 
                            SET name_event='$name', date_event='$date', desc_event='$desc'";
                
                if(isset($_FILES['image_event']) && $_FILES['image_event']['size'] > 0) {
                    $imageData = addslashes(file_get_contents($_FILES['image_event']['tmp_name']));
                    $query .= ", image_event='$imageData'";
                }
                
                $query .= " WHERE id_event=$id";
                break;
                
            case 'update-education':
                $id = intval($_POST['id_education']);
                $name = mysqli_real_escape_string($conn, $_POST['name_education']);
                $desc = mysqli_real_escape_string($conn, $_POST['desc_education']);
                
                $query = "UPDATE table_education 
                            SET name_education='$name', desc_education='$desc'";
                
                if(isset($_FILES['image_education']) && $_FILES['image_education']['size'] > 0) {
                    $imageData = addslashes(file_get_contents($_FILES['image_education']['tmp_name']));
                    $query .= ", image_education='$imageData'";
                }
                
                $query .= " WHERE id_education=$id";
                break;
        }
        
        if(mysqli_query($conn, $query)) {
            $response = ['status' => 'success'];
        } else {
            $response = ['status' => 'error', 'message' => mysqli_error($conn)];
        }
        break;

    case 'delete':
        $id = intval($_POST['id']);
        $table_map = [
            'locations' => ['table' => 'table_locations', 'id' => 'id_location'],
            'events' => ['table' => 'table_event', 'id' => 'id_event'],
            'education' => ['table' => 'table_education', 'id' => 'id_education'],
            'callus' => ['table' => 'table_callus', 'id' => 'id_call'],
            'users' => ['table' => 'table_user', 'id' => 'id_user']
        ];
        
        if (isset($table_map[$table])) {
            $info = $table_map[$table];
            $query = "DELETE FROM {$info['table']} WHERE {$info['id']}=$id";
            if (mysqli_query($conn, $query)) {
                $response = ['status' => 'success'];
            } else {
                $response = ['status' => 'error', 'message' => mysqli_error($conn)];
            }
        }
        break;

    case 'updateStatus':
        $id = intval($_POST['id']);
        $status = $_POST['status'] === 'true' ? 1 : 0;
        
        $query = "UPDATE table_callus 
                SET status_call = $status 
                WHERE id_call = $id";
                
        if (mysqli_query($conn, $query)) {
            $response = ['status' => 'success'];
        } else {
            $response = [
                'status' => 'error', 
                'message' => mysqli_error($conn)
            ];
        }
        break;
}

echo json_encode($response);
mysqli_close($conn);
?>