function createPopup(id){
    let popupNode = document.querySelector(id);
    let overlay = popupNode.querySelector(".overlay");
    let closeBtn = popupNode.querySelector(".closeBtn");
    function openPopup(){
        popupNode.classList.add("active");
    }
    function closePopup(){
        popupNode.classList.remove("active");
    }
    overlay.addEventListener("click", closePopup);
    closeBtn.addEventListener("click", closePopup);
    return openPopup;
}

let descriptionPopup = createPopup("#descriptionPopup");
document.querySelector("#openDescriptionPopup").addEventListener("click", descriptionPopup)