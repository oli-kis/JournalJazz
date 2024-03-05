let jwt = sessionStorage.getItem("token");

function LikePost(id) {
  let like = document.getElementById(`like${id}`);

  if (like.src == "http://127.0.0.1:5500/img/like.png") {
    like.src = "http://127.0.0.1:5500/img/likedNew.png";

    fetch(`https://blogchainapi.onrender.com/api/Post/AddLike?postId=${id}`, {
      method: "PATCH",
      headers: {
        Authorization: jwt,
        "content-type": "application/json",
        credentials: "same-origin",
      },
    })
      .then((response) => response.text())
      .then((data) => {});
  } else {
    like.src = "http://127.0.0.1:5500/img/like.png";

    fetch(
      `https://blogchainapi.onrender.com/api/Post/RemoveLike?postId=${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: jwt,
          "content-type": "application/json",
          credentials: "same-origin",
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {});
  }
}

function SavePost(id) {
  let save = document.getElementById(`save${id}`);

  if (save.src == "http://127.0.0.1:5500/img/save.png") {
    save.src = "http://127.0.0.1:5500/img/saved.png";

    fetch(`https://blogchainapi.onrender.com/api/Post/SavePost?postId=${id}`, {
      method: "PATCH",
      headers: {
        Authorization: jwt,
        "content-type": "application/json",
        credentials: "same-origin",
      },
    })
      .then((response) => response.text())
      .then((data) => {});
  } else {
    save.src = "http://127.0.0.1:5500/img/save.png";

    fetch(
      `https://blogchainapi.onrender.com/api/Post/UnsavePost?postId=${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: jwt,
          "content-type": "application/json",
          credentials: "same-origin",
        },
      }
    )
      .then((response) => response.text())
      .then((data) => {});
  }
}

export { LikePost, SavePost };
