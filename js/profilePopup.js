function createPopup(id) {
  let popupNode = document.querySelector(id);
  let overlay = popupNode.querySelector(".overlay");
  let closeBtn = popupNode.querySelector(".closeBtn");
  function openPopup() {
    popupNode.classList.add("active");
  }
  function closePopup() {
    popupNode.classList.remove("active");
  }
  overlay.addEventListener("click", closePopup);
  closeBtn.addEventListener("click", closePopup);
  return openPopup;
}

let profilePopup = createPopup("#profilePoppup");
document
  .querySelector("#openProfilePopup")
  .addEventListener("click", profilePopup);

async function changeProfilePic() {
  const input = document.getElementById("imageUpload");
  if (input.files.length > 0) {
    const file = input.files[0];
    const formData = new FormData();
    formData.append("newImage", file);

    try {
      const response = await fetch(
        "https://blogchainapi.onrender.com/api/User/ChangeProfilePic",
        {
          method: "PATCH",
          headers: {
            Authorization: jwt,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Image uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  } else {
    console.log("No image selected");
  }
}
