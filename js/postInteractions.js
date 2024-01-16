let jwt = sessionStorage.getitem("token");

function likePost(id) {
  let like = document.getElementById(`like${id}`);

  if (like.src == "http://127.0.0.1:5500/img/like.png") {
      like.src = "http://127.0.0.1:5500/img/likedNew.png";
  
    fetch("URL" + id, {
      headers: {
        "content-type": "application/json",
        credentials: "same-origin",
      },
    })
    .then((response) => response.json())
    .then(data => {

      let userWhoLiked = data.userliked;
      userWhoLiked.push(userId);

      fetch("URL" + id, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            credentials: "same-origin",
        },
        body: JSON.stringify({
            userliked: userWhoLiked
        })
      })
    })
    } else {
      like.src = "http://127.0.0.1:5500/img/like.png";

      fetch("URL" + id, {
        headers: {
          "content-type": "application/json",
          credentials: "same-origin",
        },
      })
      .then((response) => response.json())
      .then(data => {
  
        let userWhoLiked = data.userliked;
        let userToDislike = userWhoLiked.indexOf(userId);

        if(userToDislike > -1) {
          userWhoLiked.splice(userToDislike, 1);
        }
  
        fetch("URL" + id, {
          method: "PUT",
          headers: {
              "content-type": "application/json",
              credentials: "same-origin",
          },
          body: JSON.stringify({
              userliked: userWhoLiked
          })
      })
      })
  
    }
}

function savePost(id) {
  let save = document.getElementById(`save${id}`);

  fetch("URL" + userId, {
    headers: {
      "content-type": "application/json",
      credentials: "same-origin",
    },
  })
  .then((response) => response.json())
  .then(data => {

    let savedPosts = data.savedPosts;
    savedPosts.push(id);

    if (save.src == "http://127.0.0.1:5500/img/save.png") {
      save.src = "http://127.0.0.1:5500/img/saved.png";
  
      fetch("URL" + userId, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            credentials: "same-origin",
        },
        body: JSON.stringify({
            savedPosts: savedPosts
        })
      })
  
    } else {
      save.src = "http://127.0.0.1:5500/img/save.png";

      let postToUnsave = savedPosts.indexOf(id);

      if(postToUnsave > -1) {
        savedPosts.splice(postToUnsave, 1);
      }

      fetch("URL" + userId, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            credentials: "same-origin",
        },
        body: JSON.stringify({
            savedPosts: savedPosts
        })
      })
    }
  })
}

