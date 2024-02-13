function createPopup(id){
    let popupNode = document.querySelector(id);
    let overlay = popupNode.querySelector(".overlay");

    function bindCloseEvent() {
        let closeButtons = popupNode.querySelectorAll(".closeBtn");
        closeButtons.forEach(btn => btn.removeEventListener("click", closePopup)); // Remove existing event listeners to prevent duplicates
        closeButtons.forEach(btn => btn.addEventListener("click", closePopup));
    }

    function closePopup(){
        popupNode.classList.remove("active");
    }

    function textSelected(){
        let content = document.getElementById("createPopupContent");
        content.innerHTML = `<textarea name="createBlog" class="createBlogInput" cols="30" rows="10" placeholder="Your Blog..."></textarea>
        <div class="controls"><button class="closeBtn">Close</button><button class="submitBtn">Submit</button></div>`;
        bindCloseEvent();
    }

    function imgSelected(){
        let content = document.getElementById("createPopupContent");
        content.innerHTML = `<input type="file" id="imageUpload" accept="image/*">
        <img id="imagePreview" src="" alt="Image preview..." style="display:none; max-width: 100%; height: auto;">
        <div class="controls"><button class="closeBtn">Close</button><button class="submitBtn">Submit</button></div>`;

        document.getElementById('imageUpload').addEventListener('change', function() {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            
            reader.readAsDataURL(this.files[0]);
        });
        bindCloseEvent(); // Rebind close event
    }

    function openPopup(){
        popupNode.classList.add("active");
        let content = document.getElementById("createPopupContent");
        content.innerHTML = `<h2>What do you want to post?</h2>
        <div class="selectionBox">
          <div class="text">
            <h3>Text</h3>
            <img src="/img/text.png" alt="" onclick="textSelected()">
          </div>
          <div class="image">
            <h3>Image</h3>
            <img src="/img/image.png" alt="" onclick="imgSelected()">
          </div>
        </div> 
        <div class="controls"><button class="closeBtn">Close</button></div>`;
        bindCloseEvent(); // Bind close event for initial content

        // Make these functions accessible via the global scope or through specific event handlers
        window.textSelected = textSelected;
        window.imgSelected = imgSelected;
    }

    overlay.addEventListener("click", closePopup);

    return openPopup;
}

let createCreatePopup = createPopup("#createPopup");
document.querySelector("#openCreatePopup").addEventListener("click", createCreatePopup);
