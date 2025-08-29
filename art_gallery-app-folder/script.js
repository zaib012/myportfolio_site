// Lightbox navigation variables
let currentImageIndex = 0;
const images = Array.from(document.querySelectorAll('.gallery-item img'));
const captions = Array.from(document.querySelectorAll('.gallery-item .overlay'));

// Open lightbox with clicked image
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        updateLightbox();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// Previous image function
prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightbox();
});

// Next image function
nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigate(-1); // Previous image
        } else if (e.key === 'ArrowRight') {
            navigate(1); // Next image
        }
    }
});

// Unified navigation function
function navigate(direction) {
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    updateLightbox();
}

// Update lightbox content
function updateLightbox() {
    lightboxImg.src = images[currentImageIndex].src;
    lightboxImg.alt = images[currentImageIndex].alt;
    lightboxCaption.innerHTML = captions[currentImageIndex].innerHTML;
}

