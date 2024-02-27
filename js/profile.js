var jwt = sessionStorage.getItem("token");
SetProfile();

async function SetProfile() {
  let userData = await UserData();

  const username = document.getElementById("username");
  username.textContent = userData.username;

  const bio = document.getElementById("bio");
  bio.textContent = userData.profileDescription;

  const profileImage = document.getElementById("profileImage");
  profileImage.src = "data:image/png;base64," + userData.profileImage;

  const userImage = document.getElementById("userImage");
  userImage.src = "data:image/png;base64," + userData.profileImage;
}

async function UserData() {
  let data = await fetch("https://blogchainapi.onrender.com/api/User/Get-Me", {
    headers: {
      Authorization: jwt,
      "content-type": "application/json",
      credentials: "same-origin",
    },
  }).then((response) => response.json());

  console.log(data);
  return data;
}

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
