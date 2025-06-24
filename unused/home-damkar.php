<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>damkar-home</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style-damkar.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script-damkar.js" defer></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
    <!-- Navbar -->
    <nav class="custom_nav navbar navbar-expand-lg fixed-top px-3">
        <div class="container-lg">
            <!-- Brand -->
            <a class="navbar-brand d-flex align-items-center" href="http://localhost/_Project%20Damkar%20DB/home-damkar.php">
                <img src="Image/logo_damkar.png" alt="Logo Damkar" width="50" height="50" class="me-3">
                <div class="brand_text">
                    <div class="brand_top">Asosiasi Damkar</div>
                    <div class="brand_bottom">Jabodetabek</div>
                </div>
            </a>

            <!-- Mobile Toggle Button -->
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation Items -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto text-center fw-bold">
                    <li class="nav-item">
                        <a class="nav-link px-4 py-3" href="#event">Kegiatan</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-4 py-3" href="#education">Pelatihan</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-4 py-3" href="#callUs">Hubungi Kami</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="hero_section d-flex align-items-center">
        <video class="hero_video" autoplay muted loop playsinline>
            <source src="Video/damkar-vid.mp4" type="video/mp4">
        </video>

        <svg class="halftone_pattern_black halftone_hero" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        
        <div class="hero_content w-100">
            <div class="container-lg">
                <div class="row align-items-end">
                    <div class=" col-md-6">
                        <h1 class="header display-3 mt-4 mb-4">PANTANG MUNDUR DEMI KESELAMATAN</h1>
                        <p class="lead text-white">Saat orang lain menjauh dari api, kami maju untuk melindungi. Kami bukan hanya pemadam kebakaran — tugas kami lebih daripada itu. Kami adalah penyelamat. <i> Kucing atas pokok, kerbau masuk parit, kuda terlepas, ular dalam rumah, semua kami selamatkan!</i> </p>
                    
                        <a href="#" class="btn custom_btn px-5 py-3">GABUNG</a>
                    </div>
                    
                    <div class="col-md-6 d-flex align-items-end justify-content-end py">
                        <p class="video_state">Pause Video</p>
                        <button class="btn video_control" id="playPauseBtn">
                            <!-- Play Icon -->
                            <svg class="play_icon d-none" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="4,0 22,12 4,24" fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
                            </svg>
                            <!-- Pause Icon -->
                            <svg class="pause_icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <polygon points="8,2 8,22" stroke="white" stroke-width="3"/>
                                <polygon points="16,2 16,22" stroke="white" stroke-width="3"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <svg class="halftone_pattern_white halftone_divider_hero" width="100%" height="30px" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="30px" fill="url(#dots)"/>
        </svg>
    </section>
    
    <!-- Commitment Section -->
    <section id="commitment" class="commitment_section py-5">
        <div class="container-lg py-4">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="d-flex align-items-center gap-4 mb-4">
                        <p class="lead text-white fst-italic mb-0 flex-shrink-0">KOMITMEN KAMI</p>
                        <svg width="100%" height="4" viewBox="0 0 100% 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="1" x2="100%" y2="1" stroke="#FFB238" stroke-width="4"/>
                        </svg>
                    </div>
                    <h2 class="header display-4 text-white mb-4">SIAP MELAYANI MASYARAKAT</h2>
                    <p class="lead text-white">Asosiasi Damkar Indonesia sudah berafiliasi dengan 50 Kantor Sektor Pemadam Kebakaran yang mewakili lebih dari 10.000 pekerja pemadam kebakaran profesional di wilayah Jabodetabek. Anggota kami siap menjangkau dan melayani hingga 80% warga Jabodetabek.</p>
                </div>
            </div>
        </div>
    </section>

    <?php
        $hostname = "localhost";
        $username = "root";
        $password = "";
        $database = "database-damkar";

        $conn = mysqli_connect($hostname, $username, $password, $database);

        if (!$conn) {
            die("Koneksi gagal: " . mysqli_connect_error());
        }

        // Inisialisasi variabel events sebagai array kosong
        $events = array();
        $query = "SELECT id_event, name_event, date_event, desc_event, image_event FROM table_event ORDER BY date_event DESC";
        $result_E = mysqli_query($conn, $query);
        
        // Pastikan query berhasil dijalankan
        if ($result_E) {
            // Menyimpan data ke array untuk penggunaan JavaScript
            if (mysqli_num_rows($result_E) > 0) {
                while ($row = mysqli_fetch_assoc($result_E)) {
                    if (!empty($row['image_event'])) {
                        $row['image_event'] = base64_encode($row['image_event']);
                    }
                    $events[] = $row;
                }
            }
        } else {
            echo "Error: " . mysqli_error($conn);
        }

        $educations = array();
        $query = "SELECT id_education, name_education, desc_education, image_education FROM table_education";
        $result_T = mysqli_query($conn, $query);
        
        if ($result_T) {
            if (mysqli_num_rows($result_T) > 0) {
                while ($row = mysqli_fetch_assoc($result_T)) {
                    if (!empty($row['image_education'])) {
                        $row['image_education'] = base64_encode($row['image_education']);
                    }
                    $educations[] = $row;
                }
            }
        } else {
            echo "Error: " . mysqli_error($conn);
        }
    ?>

    <!-- Event Section -->
    <section id="event" class="event_section py-5">
        <div class="container-lg">
            <div class="row">
                <div class="col-12 mb-4">
                    <div class="header_wrapper">
                        <h2 class="header header_event display-4 text-black mb-0">KEGIATAN KAMI</h2>
                        <svg class="halftone_pattern_black halftone_event" width="100%" height="30px" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="30px" fill="url(#dots)"/>
                        </svg>
                    </div>
                </div>
            </div>

            <?php if (!empty($events)): ?>
                <div class="row mt-4 event_content">
                    <div class="col-md-6">
                        <div class="event_image_container d-flex flex-column justify-content-center">
                        <?php
                            $firstEvent = $events[0];
                            // Menampilkan gambar
                            if (!empty($firstEvent['image_event'])) {
                                echo '<img src="data:image/jpeg;base64,' . $firstEvent['image_event'] . '" alt="' . $firstEvent['name_event'] . '" class="event_image img-fluid" id="eventImage">';
                            } else {
                                echo '<img src="Image/default-event.jpg" alt="Event Default" class="event_image img-fluid" id="eventImage">';
                            }
                        ?>
                        </div>
                    </div>
                    <div class="col-md-6 d-flex flex-column justify-content-center">
                        <div class="event_date mb-3" id="eventDate">
                            <?php
                                // Format tanggal
                                $date = date_create($firstEvent['date_event']);
                                echo strtoupper(date_format($date, 'F d, Y'));
                            ?>
                        </div>
                        <div>
                            <h3 class="event_name mb-3 display-6" id="eventName">
                                <?php echo $firstEvent['name_event']; ?>
                            </h3>
                            <p class="event_description fs-6" id="eventDescription">
                                <?php echo $firstEvent['desc_event']; ?>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-12 d-flex justify-content-center">
                        <button id="prevBtn" class="btn btn-primary me-3" disabled>&laquo; Sebelumnya</button>
                        <button id="nextBtn" class="btn btn-primary" <?php echo (count($events) <= 1) ? 'disabled' : ''; ?>>Selanjutnya &raquo;</button>
                    </div>
                </div>
            <?php else: ?>
                <div class="row mt-4">
                    <div class="col-12 text-center">
                        <p>Tidak ada kegiatan yang ditemukan.</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- education Section -->
    <section class="education_section py-5" id="education">
        <div class="overlay2_education"></div>
        <div class="education_image_wrapper">
            <?php if (!empty($educations)): ?>
                <img src="data:image/jpeg;base64,<?php echo $educations[0]['image_education']; ?>" 
                    alt="education Image" class="education_image active" id="educationImage">
                <img src="" alt="education Image" class="education_image">
            <?php else: ?>
                <img src="Image/default-education.jpg" alt="education Image" class="education_image active">
            <?php endif; ?>
        </div>

        <svg class="halftone_pattern_black halftone_education_bg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
        <div class="overlay_education"></div>

        <div class="container-lg container_education">
            <div class="row">
                <div class="d-flex align-items-center gap-4 mb-4">
                    <p class="lead text-white fst-italic mb-0 flex-shrink-0">PELATIHAN</p>
                    <svg width="100%" height="4" viewBox="0 0 100% 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="0" y1="1" x2="100%" y2="1" stroke="#FFB238" stroke-width="4"/>
                    </svg>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-6">                
                    <div class="header_wrapper d-inline-block">
                        <h2 class="header header_education display-4 text-white mb-0">PENINGKATAN SKILL</h2>
                        <svg class="halftone_pattern_white halftone_education" width="100%" height="30px" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="30px" fill="url(#dots)"/>
                        </svg>
                    </div>
                </div>
            </div>
            
            <?php if (!empty($educations)): ?>
                <div class="row education_content">
                    <?php foreach ($educations as $index => $education): ?>
                        <div class="col-xl-4 col-lg-6 col-md-12">
                            <div class="education_card <?php echo $index === 0 ? 'active' : ''; ?>"
                                data-index="<?php echo $index; ?>">
                                <h3 class="education_name fs-2 mb-3" id="educationName_<?php echo $index; ?>">
                                    <?php echo $education['name_education']; ?>
                                </h3>
                                <p class="education_description fs-6" id="educationDesc_<?php echo $index; ?>">
                                    <?php echo $education['desc_education']; ?>
                                </p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="row mt-4">
                    <div class="col-12 text-center">
                        <p class="text-white">Tidak ada pelatihan yang ditemukan.</p>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Call Us Section -->
    <section id="callUs" class="callUs_section py-5">
        <div class="container-lg">
            <div class="row">
                <div class="col-12 mb-5">
                    <div class="header_wrapper">
                        <h2 class="header header_callUs display-4 text-black mb-0">Hubungi Kami</h2>
                        <svg class="halftone_pattern_black halftone_event" width="100%" height="30px" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="30px" fill="url(#dots)"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div id="map"></div>
                    <div class="search_map"></div>
                </div>
            </div>
        </div>
    </section>

    <script>
        const eventsData = <?php echo json_encode($events); ?>;
    </script>

    <script>
        const educationsData = <?php echo json_encode($educations); ?>;
    </script>
    
    <?php
        // Tutup koneksi
        mysqli_close($conn);
    ?>
</body>
</html>