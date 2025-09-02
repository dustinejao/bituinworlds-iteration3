let gsDropZones = document.querySelectorAll('.gs-drop-zone');

if (gsDropZones && gsDropZones.length > 0) {
    gsDropZones.forEach(dropZone => {
        // Add drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('gs-drop-zone--over');
        });

        ['dragleave', 'dragend'].forEach(type => {
            dropZone.addEventListener(type, (e) => {
                dropZone.classList.remove('gs-drop-zone--over');
            });
        });

        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('gs-drop-zone--over');

            const fileInput = dropZone.querySelector('.gs-drop-zone__input');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                updateThumbnail(dropZone, e.dataTransfer.files[0]);
                
                // Handle upload if dropzone has gs-drop-upload class
                if (dropZone.classList.contains('gs-drop-upload')) {
                    gsDropZoneUploadFile(dropZone, e.dataTransfer.files[0]);
                }
            }
        });

        // Add click handler for the dropzone
        dropZone.addEventListener('click', () => {
            dropZone.querySelector('.gs-drop-zone__input').click();
        });
        
        // Add change handler for the file input
        dropZone.querySelector('.gs-drop-zone__input').addEventListener('change', async (e) => {
            if (e.target.files.length) {
                updateThumbnail(dropZone, e.target.files[0]);
                
                // Handle upload if dropzone has gs-drop-upload class
                if (dropZone.classList.contains('gs-drop-upload')) {
                    gsDropZoneUploadFile(dropZone, e.target.files[0]);
                }
            }
        });
    });
}

// Helper function to display thumbnail
function updateThumbnail(dropZone, file) {
    let thumbnailElement = dropZone.querySelector('.gs-drop-zone__thumb');

    if (dropZone.querySelector('.gs-drop-zone__prompt')) {
        dropZone.querySelector('.gs-drop-zone__prompt').remove();
    }

    if (!thumbnailElement) {
        thumbnailElement = document.createElement('div');
        thumbnailElement.classList.add('gs-drop-zone__thumb');
        thumbnailElement.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;';
        dropZone.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove any existing image
            const existingImg = thumbnailElement.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
            
            // Create and append new image
            const img = document.createElement('img');
            // Check if we have an uploaded URL in the file input
            img.src = reader.result;
            img.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
            thumbnailElement.appendChild(img);
        };
    } else {
        // Clear any existing image
        const existingImg = thumbnailElement.querySelector('img');
        if (existingImg) {
            existingImg.remove();
        }
    }
}

// Helper function to upload file
async function gsDropZoneUploadFile(dropZone, file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'media_upload');

        const response = await fetch(gspbDropzoneApiSettings.rest_url, {
            method: 'POST',
            type: 'media_upload',
            body: formData,
            headers: {
                'X-WP-Nonce': gspbDropzoneApiSettings.nonce
            }
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        
        // Update the file input with the uploaded file URL
        const fileInput = dropZone.querySelector('.gs-drop-zone__input');
        if (fileInput) {
            fileInput.dataset.url = result.file_url;
        }

        // Trigger a custom event for successful upload
        dropZone.dispatchEvent(new CustomEvent('gs-file-uploaded', {
            detail: result
        }));

    } catch (error) {
        console.error('Upload error:', error);
        // Trigger a custom event for upload error
        dropZone.dispatchEvent(new CustomEvent('gs-file-upload-error', {
            detail: error
        }));
    }
}