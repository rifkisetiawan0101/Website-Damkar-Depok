document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        // Initialize Callus Table
        const callusTable = $('#callusTable').DataTable({
            data: [],
            columns: [
                { data: 'id_call', title: 'ID' },
                { data: 'name_call', title: 'Name' },
                { data: 'phone_call', title: 'Phone' },
                { data: 'address_call', title: 'Address' },
                { data: 'message_call', title: 'Message' },
                { 
                    data: 'media_call',
                    title: 'Media',
                    defaultContent: 'No Media',
                    render: function(data, type, row) {
                        if (data) {
                            if (row.media_type && row.media_type.startsWith('video/')) {
                                return `
                                    <div class="position-relative">
                                        <video width="100" height="100" class="preview-thumb" 
                                            onclick="openMediaPreview('${data}', '${row.media_type}')" 
                                            style="cursor: pointer">
                                            <source src="${data}" type="${row.media_type}">
                                        </video>
                                    </div>`;
                            } else {
                                return `
                                    <div class="position-relative">
                                        <img src="${data}" class="img-thumbnail preview-thumb" 
                                            width="100" height="100"
                                            onclick="openMediaPreview('${data}', 'image')"
                                            style="object-fit: cover; cursor: pointer">
                                    </div>`;
                            }
                        }
                        return 'No Media';
                    }
                },
                { data: 'created_at', title: 'Created At' },
                {
                    data: 'status_call',
                    title: 'Status',
                    render: function(data, type, row) {
                        return `
                            <span class="badge ${data ? 'bg-secondary' : 'bg-danger'}"
                                style="cursor: pointer"
                                onclick="handleStatus('callus', ${row.id_call}, ${data})">
                                ${data ? 'Handled' : 'Pending'}
                            </span>`;
                    }
                },
                {
                    data: null,
                    title: 'Actions',
                    render: function(data) {
                        return `<button class="btn btn-danger btn-sm" onclick="deleteRecord('callus', ${data.id_call})">Delete</button>`;
                    }
                }
            ],
            columnDefs: [
                {
                    targets: 4,
                    render: function(data) {
                        return data && data.length > 50 ? data.substr(0, 47) + '...' : data;
                    }
                }
            ]
        });

        // #Implementasi JSON Mengambil Data dengan Fetch API
        // #Implementasi AJAX read data
        fetch('../src/core/fetch-data.php?admin=1')
            .then(response => response.json())
            .then(data => {
                if (data.callus && Array.isArray(data.callus)) {
                    callusTable.clear().rows.add(data.callus).draw();
                }
                initializeTables(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert('Error loading data. Please refresh the page.');
            });

        function initializeTables(data) {
            // Initialize Locations Table
            $('#locationsTable').DataTable({
                data: data.locations,
                columns: [
                    { data: 'id', title: 'ID' },
                    { data: 'name', title: 'Name' },
                    { data: 'lat', title: 'Latitude' },
                    { data: 'lng', title: 'Longitude' },
                    {
                        data: null,
                        title: 'Actions',
                        render: function(data) {
                            return `
                                <button class="btn btn-warning btn-sm me-1" onclick="openEditModal('locations', ${data.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteRecord('locations', ${data.id})">Delete</button>
                            `;
                        }
                    }
                ]
            });

            // Initialize Events Table
            $('#eventsTable').DataTable({
                data: data.events,
                columns: [
                    { data: 'id_event', title: 'ID' },
                    { data: 'name_event', title: 'Name' },
                    { data: 'date_event', title: 'Date' },
                    { data: 'desc_event', title: 'Description' },
                    { 
                        data: 'image_event',
                        title: 'Image',
                        render: function(data) {
                            return data ? 
                                `<img src="data:image/jpeg;base64,${data}" 
                                    class="img-thumbnail preview-thumb" 
                                    width="100"
                                    height="100"
                                    onclick="openMediaPreview('data:image/jpeg;base64,${data}', 'image')"
                                    style="object-fit: cover; cursor: pointer">` : 
                                'No Image';
                        }
                    },
                    {
                        data: null,
                        title: 'Actions',
                        render: function(data) {
                            return `
                                <button class="btn btn-warning btn-sm me-1" onclick="openEditModal('events', ${data.id_event})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteRecord('events', ${data.id_event})">Delete</button>
                            `;
                        }
                    }
                ]
            });

            // Initialize education Table
            $('#educationTable').DataTable({
                data: data.educations,
                columns: [
                    { data: 'id_education', title: 'ID' },
                    { data: 'name_education', title: 'Name' },
                    { data: 'desc_education', title: 'Description' },
                    {
                        data: 'image_education',
                        title: 'Image',
                        render: function(data) {
                            return data ? 
                                `<img src="data:image/jpeg;base64,${data}" 
                                    class="img-thumbnail preview-thumb" 
                                    width="100"
                                    height="100"
                                    onclick="openMediaPreview('data:image/jpeg;base64,${data}', 'image')"
                                    style="object-fit: cover; cursor: pointer">` : 
                                'No Image';
                        }
                    },
                    {
                        data: null,
                        title: 'Actions',
                        render: function(data) {
                            return `
                                <button class="btn btn-warning btn-sm me-1" onclick="openEditModal('education', ${data.id_education})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteRecord('education', ${data.id_education})">Delete</button>
                            `;
                        }
                    }
                ]
            });

            // Initialize Users Table
            $('#usersTable').DataTable({
                data: data.users,
                columns: [
                    { data: 'id_user', title: 'ID' },
                    { data: 'username', title: 'Username' },
                    { data: 'created_at', title: 'Created At' },
                    {
                        data: null,
                        title: 'Actions',
                        render: function(data) {
                            return `<button class="btn btn-danger btn-sm" onclick="deleteRecord('users', ${data.id_user})">Delete</button>`;
                        }
                    }
                ]
            });
        }

        // Function to derive table name from form ID
        function getTableName(formId) {
            const formToTableMap = {
                locationForm: 'locations',
                eventForm: 'events',
                educationForm: 'education',
                editFormLocation: 'update-locations',
                editFormEvent: 'update-events',
                editFormEducation: 'update-education',

                location: 'locations',
                event: 'events',
            };
            return formToTableMap[formId] || '';
        }

        function refreshTable(tableName) {
            fetch('../src/core/fetch-data.php?admin=1')
                .then(response => response.json())
                .then(data => {
                    const table = $(`#${tableName}Table`).DataTable();
                    table.clear();
                    switch(tableName) {
                        case 'locations':
                            table.rows.add(data.locations);
                            break;
                        case 'events':
                            table.rows.add(data.events);
                            break;
                        case 'education':
                            table.rows.add(data.educations);
                            break;
                        case 'callus':
                            table.rows.add(data.callus);
                            break;
                        case 'users':
                            table.rows.add(data.users);
                            break;
                    }
                    table.draw();
                });
        }

        window.openMediaPreview = function(src, type) {
            // Hapus modal lama jika ada
            $('#mediaPreviewModal').remove();

            // Buat modal baru
            const modal = $(`
                <div class="modal fade" id="mediaPreviewModal" tabindex="-1">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Media Preview</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body text-center p-0">
                                ${type && type.startsWith('video/') ? 
                                    `<video controls style="max-width: 100%; max-height: 80vh;">
                                        <source src="${src}" type="${type}">
                                        Your browser does not support the video tag.
                                    </video>` :
                                    `<img src="${src}" style="max-width: 100%; max-height: 80vh;">`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `);

            // Hapus modal dari DOM setelah ditutup
            modal.on('hidden.bs.modal', function() {
                modal.remove();
            });

            // Tampilkan modal
            modal.appendTo('body').modal('show');
        };

        // Add Data Record Functions (CREATE)
        $('#locationForm, #eventForm, #educationForm').on('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.append('action', 'add');
            formData.append('table', getTableName(this.id));

            // #Implementasi AJAX create data
            fetch('../src/core/process-data.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    $(`#${this.id.replace('Form', '')}Modal`).modal('hide');
                    refreshTable(getTableName(this.id));
                    $(this).trigger('reset');
                    alert('Add data success');
                } else {
                    alert(data.message || 'Error add data');
                }
            })
            .catch(error => {
                alert('An error occurred while add data');
            });
        });

        // Open Edit Modal Function
        window.openEditModal = function(table, id) {
            console.log('Opening edit modal for', table, 'with id', id); // Debug log
            
            fetch(`../src/core/fetch-data.php?table=${table}&id=${id}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched data for edit:', data); // Debug log
                    
                    switch(table) {
                        case 'locations':
                            $('#editLocationModal').modal('show');
                            $('#editFormLocation [name="id_location"]').val(id);
                            $('#editFormLocation [name="name_location"]').val(data.name_location);
                            $('#editFormLocation [name="lat_location"]').val(data.lat_location);
                            $('#editFormLocation [name="long_location"]').val(data.long_location);
                            break;
                            
                        case 'events':
                            $('#editEventModal').modal('show');
                            $('#editFormEvent [name="id_event"]').val(id);
                            $('#editFormEvent [name="name_event"]').val(data.name_event);
                            $('#editFormEvent [name="date_event"]').val(data.date_event);
                            $('#editFormEvent [name="desc_event"]').val(data.desc_event);
                            if(data.image_event) {
                                $('#editEventImagePreview').html(
                                    `<img src="data:image/jpeg;base64,${data.image_event}" class="img-thumbnail" width="100">`
                                );
                            }
                            break;
                            
                        case 'education':
                            $('#editEducationModal').modal('show');
                            $('#editFormEducation [name="id_education"]').val(id);
                            $('#editFormEducation [name="name_education"]').val(data.name_education);
                            $('#editFormEducation [name="desc_education"]').val(data.desc_education);
                            if(data.image_education) {
                                $('#editEducationImagePreview').html(
                                    `<img src="data:image/jpeg;base64,${data.image_education}" class="img-thumbnail" width="100">`
                                );
                            }
                            break;
                    }
                })
                .catch(error => {
                    alert('Error loading data for edit');
                });
        };

        // Update Data Record Functions (UPDATE)
        $('#editFormLocation, #editFormEvent, #editFormEducation').on('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.append('action', 'update');
            formData.append('table', getTableName(this.id));
            const table = this.id.replace('editForm', '').toLowerCase();
            
            const baseTableName = this.id.replace('editForm', '');

            // #Implementasi AJAX update data
            fetch('../src/core/process-data.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Update response:', data); // Debug log
                if(data.status === 'success') {
                    $(`#edit${baseTableName}Modal`).modal('hide');
                    refreshTable(getTableName(table));
                    $(this).trigger('reset');
                    alert('Update successful');
                } else {
                    alert(data.message || 'Error updating data');
                }
            })
            .catch(error => {
                console.error('Update error:', error);
                alert('Error updating: ' + error);
            });
        });

        // Delete record function
        window.deleteRecord = function(table, id) {
            // Store delete info in modal
            $('#deleteTable').val(table);
            $('#deleteId').val(id);
            
            // Show delete modal
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        };

        // Add event listener for delete confirmation
        document.getElementById('confirmDelete').addEventListener('click', function() {
            const table = $('#deleteTable').val();
            const id = $('#deleteId').val();
            
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('table', table);
            formData.append('id', id);

            // #Implementasi AJAX delete data
            fetch('../src/core/process-data.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    refreshTable(table);
                    
                    // Show success toast/alert
                    const successToast = `
                        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                            <div class="toast align-items-center text-white bg-success border-0" role="alert">
                                <div class="d-flex">
                                    <div class="toast-body">
                                        Record deleted successfully
                                    </div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                                </div>
                            </div>
                        </div>`;
                    
                    $(successToast).appendTo('body').find('.toast').toast('show');
                    
                    // Hide delete modal
                    bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                } else {
                    // Show error message in modal
                    const errorAlert = `<div class="alert alert-danger mt-3">${data.message}</div>`;
                    $('#deleteModal .modal-body').append(errorAlert);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Show error message in modal
                const errorAlert = `<div class="alert alert-danger mt-3">An error occurred while deleting</div>`;
                $('#deleteModal .modal-body').append(errorAlert);
            });
        });

        // Add the handle status function
        window.handleStatus = function(table, id, currentStatus) {
            $('#statusTable').val(table);
            $('#statusId').val(id);
            $('#newStatus').val(!currentStatus);
            $('#statusText').text(!currentStatus ? 'handled' : 'pending');
            
            const handleStatusModal = new bootstrap.Modal(document.getElementById('handleStatusModal'));
            handleStatusModal.show();
        };

        // Add event listener for status confirmation
        document.getElementById('confirmStatus').addEventListener('click', function() {
            const table = $('#statusTable').val();
            const id = $('#statusId').val();
            const newStatus = $('#newStatus').val();
            
            const formData = new FormData();
            formData.append('action', 'updateStatus');
            formData.append('table', table);
            formData.append('id', id);
            formData.append('status', newStatus);

            fetch('../src/core/process-data.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    refreshTable(table);
                    
                    // Show success toast
                    const successToast = `
                        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                            <div class="toast align-items-center text-white bg-success border-0" role="alert">
                                <div class="d-flex">
                                    <div class="toast-body">
                                        Status updated successfully
                                    </div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                                </div>
                            </div>
                        </div>`;
                    
                    $(successToast).appendTo('body').find('.toast').toast('show');
                    
                    // Hide status modal
                    bootstrap.Modal.getInstance(document.getElementById('handleStatusModal')).hide();
                } else {
                    const errorAlert = `<div class="alert alert-danger mt-3">${data.message}</div>`;
                    $('#handleStatusModal .modal-body').append(errorAlert);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const errorAlert = `<div class="alert alert-danger mt-3">An error occurred while updating status</div>`;
                $('#handleStatusModal .modal-body').append(errorAlert);
            });
        });
    });
});