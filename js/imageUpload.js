document.getElementById('imageUpload').addEventListener('change', function() {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Get the image preview element
        const imagePreview = document.getElementById('imagePreview');
        
        // Set the src of the image preview to the file's data URL
        imagePreview.src = e.target.result;
        
        // Make the image visible
        imagePreview.style.display = 'block';
    };
    
    // Read the selected file as Data URL
    reader.readAsDataURL(this.files[0]);
});