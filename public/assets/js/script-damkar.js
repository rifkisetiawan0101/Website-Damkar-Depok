function initNavbar() {
    const navbar = document.querySelector('.custom_nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const brandTop = document.querySelector('.brand_top');
    const brandBottom = document.querySelector('.brand_bottom');
    
    const initialBackground = `linear-gradient(90deg, 
        rgba(12, 12, 45, 1) 40%, 
        rgba(12, 12, 45, 0.33) 65%,
        rgba(12, 12, 45, 1) 90%
    )`;
    const scrollBackground = 'whitesmoke';
    
    function checkScroll() {
        if (window.scrollY > 50) {
            navbar.style.background = scrollBackground;
            navbar.style.boxShadow = '0 4px 8px 0 rgba(12, 12, 45, 0.2)';
            navLinks.forEach(link => {
                link.style.color = 'rgba(12, 12, 45, 1)';
            });
            
            if (brandTop) brandTop.style.color = 'rgba(220, 53, 69, 1)';
            if (brandBottom) brandBottom.style.color = 'rgba(220, 53, 69, 1)';
            
        } else {
            navbar.style.background = initialBackground;
            navbar.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.6)';            
            navLinks.forEach(link => {
                link.style.color = 'ghostwhite';
            });
            
            if (brandTop) brandTop.style.color = 'ghostwhite';
            if (brandBottom) brandBottom.style.color = 'ghostwhite';
        }
    }
    
    checkScroll();
    window.addEventListener('scroll', checkScroll);
}

function initVideoPlayer () {
    const video = document.querySelector('.hero_video');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = playPauseBtn.querySelector('.play_icon');
    const pauseIcon = playPauseBtn.querySelector('.pause_icon');
    const videoState = document.querySelector('.video_state');

    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playIcon.classList.add('d-none');
            pauseIcon.classList.remove('d-none');
            videoState.textContent = 'Pause Video';
        } else {
            video.pause();
            playIcon.classList.remove('d-none');
            pauseIcon.classList.add('d-none');
            videoState.textContent = 'Play Video';
        }
    });
}

function initPatterns() {
    updateAllPatterns();
    window.addEventListener('resize', debounce(updateAllPatterns, 250));
    
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }
    
    function updateAllPatterns() {
        const blackPatterns = document.querySelectorAll('.halftone_pattern_black');
        blackPatterns.forEach(svg => createPattern(svg, 'black'));
        
        const whitePatterns = document.querySelectorAll('.halftone_pattern_white');
        whitePatterns.forEach(svg => createPattern(svg, 'white'));
    }

    function createPattern(svg, fillColor) {
        svg.innerHTML = '';
        
        const patternSize = 6;
        const patternId = `halftone-${fillColor}-${Math.random().toString(36).substr(2, 9)}`;
        
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        
        const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", patternId);
        pattern.setAttribute("width", patternSize);
        pattern.setAttribute("height", patternSize);
        pattern.setAttribute("patternUnits", "userSpaceOnUse");
        pattern.setAttribute("patternTransform", "rotate(45)");
        
        // Create dot in pattern
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", patternSize/2);
        dot.setAttribute("cy", patternSize/2);
        dot.setAttribute("r", 1.1);
        dot.setAttribute("fill", fillColor);
        dot.setAttribute("fill-opacity", "1");
        
        // Assemble the pattern
        pattern.appendChild(dot);
        defs.appendChild(pattern);
        svg.appendChild(defs);
        
        // Create rectangle that uses the pattern
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", "100%");
        rect.setAttribute("height", "100%");
        rect.setAttribute("fill", `url(#${patternId})`);
        
        svg.appendChild(rect);
    }
}

let events = [];
let educations = [];
let locations = [];
let callus = [];
let currentEventIndex = 0;
let currentEducationIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initVideoPlayer();
    initPatterns();

    // #Implementasi JSON Mengambil Data dengan Fetch API
    // #Implementasi AJAX Mengambil Data dengan Fetch API
    fetch('../src/core/fetch-data.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.events && data.events.length > 0) {
                events = data.events;
                setupEventNavigation();
                displayEvent(0); // Display first event
            }

            if (data.educations && data.educations.length > 0) {
                educations = data.educations;
                setupEducationCards();
                displayEducation(0, 
                    document.querySelectorAll('.education_card'),
                    document.querySelectorAll('.education_image')
                );
            }

            if (data.locations && data.locations.length > 0) {
                locations = data.locations;
                loadMap();
            }

            if (data.callus && data.callus.length > 0) {
                callus = data.callus;
            }
        })
        .catch(error => {
            console.error('Error details:', error);
            alert('Terjadi kesalahan saat memuat data. Silakan refresh halaman.');
        });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

function displayEvent(index) {
    if (index < 0 || index >= events.length) return;
    
    const event = events[index];
    const dateObj = new Date(event.date_event);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    // Update event content
    const eventContent = document.querySelector('.event_content');
    eventContent.innerHTML = `
        <div class="col-md-4">
            <div class="event_image_container d-flex flex-column justify-content-center">
                <img src="data:image/jpeg;base64,${event.image_event}" 
                    alt="${event.name_event}" 
                    class="event_image img-fluid" 
                    id="eventImage">
            </div>
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center">
            <div class="event_date mb-3" id="eventDate">
                ${dateObj.toLocaleDateString('id-ID', options).toUpperCase()}
            </div>
            <div>
                <h3 class="event_name mb-3 display-6" id="eventName">
                    ${event.name_event}
                </h3>
                <p class="event_description fs-6" id="eventDescription">
                    ${event.desc_event}
                </p>
            </div>
        </div>
    `;
    
    currentEventIndex = index;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = (currentEventIndex === 0);
    document.getElementById('nextBtn').disabled = (currentEventIndex === events.length - 1);
}

function displayEducation(index, cards, images) {
    if (index < 0 || index >= educations.length) return;
    
    const education = educations[index];
    currentEducationIndex = index;

    // Update active card
    cards.forEach(c => c.classList.remove('active'));
    cards[index].classList.add('active');

    // Update image with crossfade
    if (education.image_education) {
        images[1].src = 'data:image/jpeg;base64,' + education.image_education;
        images[0].classList.remove('active');
        images[1].classList.add('active');
        [images[0], images[1]] = [images[1], images[0]];
    }
}

function setupEventNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentEventIndex > 0) {
                displayEvent(currentEventIndex - 1);
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentEventIndex < events.length - 1) {
                displayEvent(currentEventIndex + 1);
            }
        });
    }
}

function setupEducationCards() {
    const educationContent = document.querySelector('.education_content');
    
    // Generate education cards HTML
    educationContent.innerHTML = educations.map((education, index) => `
        <div class="col-xl-4 col-lg-6 col-md-12">
            <div class="education_card ${index === 0 ? 'active' : ''}" 
                data-index="${index}">
                <h3 class="education_name fs-2 mb-3" id="educationName_${index}">
                    ${education.name_education}
                </h3>
                <p class="education_description fs-6" id="educationDesc_${index}">
                    ${education.desc_education}
                </p>
            </div>
        </div>
    `).join('');

    // Add event listeners to new cards
    const educationCards = document.querySelectorAll('.education_card');
    const educationImages = document.querySelectorAll('.education_image');
    
    educationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const index = parseInt(this.dataset.index);
            displayEducation(index, educationCards, educationImages);
        });
    });
}

// MAP SECTION
function loadMap() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = initMap;
    script.onerror = () => console.error('Failed to load Leaflet');
    document.body.appendChild(script);
}

function initMap() {
    // Calculate map center based on all locations
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    // Initialize map
    const map = L.map('map').setView([avgLat, avgLng], 12);
    const markers = [];
    let searchMarker = null;
    
    // Add map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Create marker icons
    const fireStationIcon = L.icon({
        iconUrl: 'assets/images/fire-station.png',
        iconSize: [32, 32],
        iconAnchor: [17, 0],
        popupAnchor: [0, 0]
    });
    
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    const fireIcon = L.icon({
        iconUrl: 'assets/images/fire-marker.png',
        iconSize: [45, 45],
        iconAnchor: [23, 0],
        popupAnchor: [0, 0]
    });

    const rescueIcon = L.icon({
        iconUrl: 'assets/images/rescue-marker.png', // pastikan file ini ada di folder assets/images/
        iconSize: [40, 40],
        iconAnchor: [20, 0],
        popupAnchor: [0, 0]
    });
    
    // Function to add or update search marker
    function addSearchMarker(lat, lng, popupText) {
        if (searchMarker) map.removeLayer(searchMarker);
        searchMarker = L.marker([lat, lng], {icon: redIcon}).addTo(map);
        searchMarker.bindPopup(`<b>Lokasi:</b><br>${popupText}`);
        searchMarker.openPopup();
    }
    
    // Add markers for fire stations
    locations.forEach((location, i) => {
        const marker = L.marker([location.lat, location.lng], {icon: fireStationIcon}).addTo(map);
        markers.push(marker);
        
        marker.bindPopup(`<b>${location.name}</b>`);
        marker.on('click', function() {
            this.openPopup();
            document.getElementById('searchInput').value = location.name;
        });
    });

    // Add markers for fire incidents
    callus.filter(call => call.status_call === false && call.lat_call && call.lng_call)
        .forEach(call => {
            let icon, popupTitle;
            if (call.message_call && call.message_call.startsWith('Kebakaran')) {
                icon = fireIcon;
                popupTitle = '<b>Kebakaran Dilaporkan</b>';
            } else if (call.message_call && call.message_call.startsWith('Evakuasi')) {
                icon = rescueIcon;
                popupTitle = '<b>Evakuasi Dilaporkan</b>';
            } else {
                // Default to fireIcon if prefix not found
                icon = rescueIcon;
                popupTitle = '<b>Laporan Dilaporkan</b>';
            }

            const marker = L.marker([call.lat_call, call.lng_call], {icon: icon}).addTo(map);
            marker.bindPopup(`
                ${popupTitle}<br>
                Lokasi: ${call.address_call || '-'}<br>
                Waktu: ${call.created_at}
            `);
        });

    // Handle map click event
    map.on('click', function(e) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    document.getElementById('searchInput').value = data.display_name;
                    document.getElementById('address').value = data.display_name;
                    document.getElementById('lat').value = e.latlng.lat;
                    document.getElementById('lng').value = e.latlng.lng;
                    addSearchMarker(e.latlng.lat, e.latlng.lng, data.display_name);
                }
            });
    });
    
    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function performSearch() {
        const searchText = searchInput.value.trim();
        
        // First check if text matches any fire station name
        const matchedLocation = locations.find(loc => 
            loc.name.toLowerCase().includes(searchText.toLowerCase())
        );
        
        if (matchedLocation) {
            map.setView([matchedLocation.lat, matchedLocation.lng], 15);
            const index = locations.indexOf(matchedLocation);
            markers[index].openPopup();
            document.getElementById('address').value = searchText;
        } else {
            // If not found in our list, geocode the address
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        map.setView([lat, lon], 15);
                        addSearchMarker(lat, lon, searchText);
                        document.getElementById('address').value = searchText;
                    } else {
                        alert('Lokasi tidak ditemukan. Silakan coba pencarian lain.');
                    }
                })
                .catch(error => {
                    console.error('Error searching location:', error);
                    alert('Terjadi kesalahan saat mencari lokasi.');
                });
        }
    }
    
    // Set up event listeners for search
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });

    // Set up Jenis Laporan
    const messageInput = document.getElementById('message');
    const radioKebakaran = document.getElementById('radioKebakaran');
    const radioEvakuasi = document.getElementById('radioEvakuasi');

    function getPrefix() {
        return radioKebakaran.checked ? 'Kebakaran ' : 'Evakuasi ';
    }

    function setPrefixAndCaret() {
        const prefix = getPrefix();
        if (!messageInput.value.startsWith(prefix)) {
            // Hapus prefix lama jika ada, lalu tambahkan prefix baru
            let val = messageInput.value;
            val = val.replace(/^Kebakaran |^Evakuasi /, '');
            messageInput.value = prefix + val;
        }
        // Set caret ke akhir
        setTimeout(() => {
            messageInput.setSelectionRange(messageInput.value.length, messageInput.value.length);
        }, 0);
    }

    // Saat radio berubah
    radioKebakaran.addEventListener('change', setPrefixAndCaret);
    radioEvakuasi.addEventListener('change', setPrefixAndCaret);

    // Saat user mengetik, pastikan prefix tetap ada
    messageInput.addEventListener('input', function() {
        setPrefixAndCaret();
    });

    // Saat fokus, pastikan prefix tetap ada
    messageInput.addEventListener('focus', setPrefixAndCaret);

    // Inisialisasi awal
    setPrefixAndCaret();
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);

    const mediaInput = document.getElementById('mediaInput');
    if (mediaInput.files[0]) {
        formData.append('media_call', mediaInput.files[0]);
    }

    formData.append('lat_call', document.getElementById('lat').value);
    formData.append('lng_call', document.getElementById('lng').value);

    fetch('../src/core/submit-callus.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const formResponse = document.getElementById('formResponse');
        if (formResponse) {
            formResponse.classList.remove('d-none', 'alert-success', 'alert-danger');
            formResponse.classList.add(data.status === 'success' ? 'alert-success' : 'alert-danger');
            formResponse.textContent = data.message;
        }

        if (data.status === 'success') {
            this.reset();
            document.getElementById('mediaPreview').innerHTML = '';
        }
    })
    .catch(error => {
        console.error('Submission error:', error);
        alert('Terjadi kesalahan saat mengirim form. Silakan coba lagi.');
    });
}

function previewMedia(input) {
    const preview = document.getElementById('mediaPreview');
    const file = input.files[0];
    
    // Clear previous preview
    preview.innerHTML = '';
    
    if (file) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File terlalu besar. Maksimal ukuran file adalah 10MB');
            input.value = '';
            return;
        }

        if (file.type.startsWith('image/')) {
            // Handle image
            const img = document.createElement('img');
            img.classList.add('img-fluid', 'mt-2');
            img.file = file;
            preview.appendChild(img);

            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            // Handle video
            const video = document.createElement('video');
            video.classList.add('img-fluid', 'mt-2');
            video.controls = true;
            preview.appendChild(video);

            const reader = new FileReader();
            reader.onload = (e) => video.src = e.target.result;
            reader.readAsDataURL(file);
        }
    }
}