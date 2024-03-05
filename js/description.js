var jwt = sessionStorage.getItem("token");

async function editDesc() {
  let desc = document.getElementById("description").value;

  fetch(
    `https://blogchainapi.onrender.com/api/User/ChangeDescription?description=${encodeURIComponent(
      desc
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/text",
        Authorization: jwt,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      location.reload();
      return response.text();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
