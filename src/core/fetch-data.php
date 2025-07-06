<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    session_start();
    require_once '../config/db-config.php';

    // Check database connection
    if (!$conn) {
        throw new Exception("Database connection failed: " . mysqli_connect_error());
    }

    // #Implementasi JSON Mengubah array PHP menjadi string JSON
    $response = array(
        'status' => 'success',
        'events' => array(),
        'educations' => array(),
        'locations' => array(),
        'callus' => array(),
        'users' => array()
    );

    // Fetch Events with error checking
    $query_E = "SELECT id_event, name_event, date_event, desc_event, image_event 
                FROM table_event ORDER BY date_event DESC";
    $result_E = mysqli_query($conn, $query_E);
    if (!$result_E) {
        throw new Exception("Events query failed: " . mysqli_error($conn));
    }
    while ($row = mysqli_fetch_assoc($result_E)) {
        if (!empty($row['image_event'])) {
            $row['image_event'] = base64_encode($row['image_event']);
        }
        $response['events'][] = $row;
    }

    // Fetch educations with error checking
    $query_Ed = "SELECT id_education, name_education, desc_education, image_education 
                FROM table_education";
    $result_Ed = mysqli_query($conn, $query_Ed);
    if (!$result_Ed) {
        throw new Exception("Educations query failed: " . mysqli_error($conn));
    }
    while ($row = mysqli_fetch_assoc($result_Ed)) {
        if (!empty($row['image_education'])) {
            $row['image_education'] = base64_encode($row['image_education']);
        }
        $response['educations'][] = $row;
    }

    // Fetch Locations with error checking
    $query_L = "SELECT id_location, lat_location, long_location, name_location 
                FROM table_locations";
    $result_L = mysqli_query($conn, $query_L);
    if (!$result_L) {
        throw new Exception("Locations query failed: " . mysqli_error($conn));
    }
    while ($row = mysqli_fetch_assoc($result_L)) {
        $response['locations'][] = array(
            'id' => $row['id_location'],
            'lat' => floatval($row['lat_location']),
            'lng' => floatval($row['long_location']),
            'name' => $row['name_location']
        );
    }

    // Admin-only fetches
    if (isset($_SESSION['user_id'])) {
        // Fetch Messages
        $query_C = "SELECT id_call, name_call, phone_call, address_call, lat_call, lng_call, 
                    message_call, media_call, media_type, status_call, created_at 
                    FROM table_callus 
                    ORDER BY created_at DESC";
        $result_C = mysqli_query($conn, $query_C);
        if (!$result_C) {
            throw new Exception("Messages query failed: " . mysqli_error($conn));
        }
        while ($row = mysqli_fetch_assoc($result_C)) {
            $callData = array(
                'id_call' => $row['id_call'],
                'name_call' => $row['name_call'],
                'phone_call' => $row['phone_call'],
                'address_call' => $row['address_call'],
                'message_call' => $row['message_call'],
                'created_at' => $row['created_at'],
                'status_call' => (bool)$row['status_call'],  // Convert to boolean
                'lat_call' => isset($row['lat_call']) ? floatval($row['lat_call']) : null,
                'lng_call' => isset($row['lng_call']) ? floatval($row['lng_call']) : null
            );

            // If media exists, use the file path from Uploads directory
            if (!empty($row['media_call'])) {
                // Convert file path to URL
                $callData['media_call'] = str_replace('\\', '/', $row['media_call']);
                $callData['media_type'] = $row['media_type'];
            } else {
                $callData['media_call'] = null;
                $callData['media_type'] = null;
            }

            $response['callus'][] = $callData;
        }

        // Fetch Users
        $query_U = "SELECT id_user, username, created_at FROM table_user";
        $result_U = mysqli_query($conn, $query_U);
        if (!$result_U) {
            throw new Exception("Users query failed: " . mysqli_error($conn));
        }
        while ($row = mysqli_fetch_assoc($result_U)) {
            $response['users'][] = $row;
        }
    }

    // Single record fetch
    if(isset($_GET['table']) && isset($_GET['id'])) {
        $table = $_GET['table'];
        $id = intval($_GET['id']);
        
        $query = "";
        switch($table) {
            case 'locations':
                $query = "SELECT * FROM table_locations WHERE id_location = ?";
                break;
            case 'events':
                $query = "SELECT * FROM table_event WHERE id_event = ?";
                break;
            case 'education':
                $query = "SELECT * FROM table_education WHERE id_education = ?";
                break;
            default:
                throw new Exception("Invalid table specified");
        }
        
        $stmt = mysqli_prepare($conn, $query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . mysqli_error($conn));
        }
        
        mysqli_stmt_bind_param($stmt, "i", $id);
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Execute failed: " . mysqli_stmt_error($stmt));
        }
        
        $result = mysqli_stmt_get_result($stmt);
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            if(isset($row['image_event'])) {
                $row['image_event'] = base64_encode($row['image_event']);
            }
            if(isset($row['image_education'])) {
                $row['image_education'] = base64_encode($row['image_education']);
            }
            echo json_encode($row);
            mysqli_close($conn);
            exit;
        }
        
        echo json_encode(['status' => 'error', 'message' => 'Record not found']);
        mysqli_close($conn);
        exit;
    }

    // Output final response
    $jsonResponse = json_encode($response);
    if ($jsonResponse === false) {
        throw new Exception("JSON encoding failed: " . json_last_error_msg());
    }
    echo $jsonResponse;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        mysqli_close($conn);
    }
}
?>