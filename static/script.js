document.getElementById('comicForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);

    // Show the loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';

    fetch('/generate_comic', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        // Prepare to check image load status
        let imagesLoaded = 0;
        const totalImages = data.length;
        
        const comicPanelsDiv = document.getElementById('comicPanels');
        comicPanelsDiv.innerHTML = ''; // Clear existing panels

        data.forEach(imgDataUrl => {
            const panel = document.createElement('div');
            panel.className = 'comic-panel';

            if (!imgDataUrl.startsWith("Error:")) {
                const img = new Image();
                img.onload = () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        // All images are loaded, show the modal
                        document.getElementById('loadingIndicator').style.display = 'none';
                        document.getElementById('comicModal').style.display = 'block';
                    }
                };
                img.src = imgDataUrl;
                panel.style.backgroundImage = `url('${imgDataUrl}')`;
                panel.style.backgroundSize = 'cover';
                panel.style.backgroundPosition = 'center';
            } else {
                // Handle errors for individual images
                panel.innerText = imgDataUrl;
                imagesLoaded++;
            }

            comicPanelsDiv.appendChild(panel);
        });

        if (imagesLoaded === totalImages) {
            // In case there are no images to load (all errors)
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('comicModal').style.display = 'block';
        }
    }).catch(error => {
        // Hide the loading indicator and show error message
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('comicPanels').innerHTML = '<p>Error loading comic panels.</p>';
        console.error('Error:', error);
    });
});

// Close button functionality
var closeButton = document.getElementsByClassName("close-button")[0];
closeButton.onclick = function() {
    var modal = document.getElementById('comicModal');
    modal.style.display = "none";
}

// Clicking outside the modal closes it
window.onclick = function(event) {
    var modal = document.getElementById('comicModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
