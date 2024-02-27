import { LikePost, SavePost } from "./postInteractions.js";

let jwt = sessionStorage.getItem("token");
const postContainer = document.getElementById("postContainer");
let accountId = "";
let accountIdSavedPosts = [];

let dateTimeNow = new Date();
let publishedFinal;

GetUser();
DisplayPosts();

function GetUser() {
  fetch("https://blogchainapi.onrender.com/api/User/Get-Me", {
    headers: {
      Authorization: jwt,
      "content-type": "application/json",
      credentials: "same-origin",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      accountId = data.id;
      accountIdSavedPosts.push(data.savedPosts);

      const profileImage = document.getElementById("userImage");
      profileImage.src = "data:image/png;base64," + data.profileImage;
    });
}

async function GetAuthorData(id) {
  let authorData = await fetch(
    `https://blogchainapi.onrender.com/api/User/GetProfile?id=${id}`,
    {
      headers: {
        "content-type": "application/json",
        credentials: "same-origin",
      },
    }
  ).then((response) => response.json());
  return authorData;
}

async function DisplayData() {
  await fetch("https://blogchainapi.onrender.com/api/Post/GetAll", {
    headers: {
      "content-type": "application/json",
      credentials: "same-origin",
    },
  })
    .then((response) => response.json())
    .then(async (json) => {
      console.log(json);
      for (let x = 0; x < json.length; x++) {
        const element = json[x];
        let authorData = await GetAuthorData(element.authorId);

        console.log(element);
        let post = document.createElement("div");
        post.classList.add("post");
        post.id = element.id;

        let topline = document.createElement("div");
        topline.classList.add("topLine");
        let profileImg = document.createElement("img");
        profileImg.src = "data:image/png;base64," + authorData.profileImage;
        profileImg.alt = "";
        let username = document.createElement("span");
        username.classList.add("username");
        username.innerHTML = authorData.username;

        CalculatePublishedDifference(element.published);

        let time = document.createElement("span");
        time.classList.add("time");
        time.innerHTML = publishedFinal;

        const likes = document.createElement("p");
        let heartAmount = element.likedBy.length;
        likes.textContent = heartAmount;
        likes.className = "likeamount";

        topline.appendChild(profileImg);
        topline.appendChild(username);
        topline.appendChild(time);
        post.appendChild(topline);

        let content = document.createElement("div");
        content.classList.add("content");

        if (element.text !== null) {
          let caption = document.createElement("div");
          caption.classList.add("caption");
          caption.innerHTML = element.text;
          content.appendChild(caption);
        } else {
          let image = document.createElement("img");
          image.classList.add("caption");
          image.src = "data:image/png;base64," + element.image;
          content.appendChild(image);
        }

        post.appendChild(content);

        let bottomline = document.createElement("div");
        bottomline.classList.add("bottomLine");

        let likebtn = document.createElement("img");
        if (element.likedBy.includes(accountId)) {
          likebtn.src = "http://127.0.0.1:5500/img/likedNew.png";
        } else {
          likebtn.src = "http://127.0.0.1:5500/img/like.png";
        }
        likebtn.alt = "";
        likebtn.id = `like${element.id}`;

        let commentbtn = document.createElement("img");
        commentbtn.src = "http://127.0.0.1:5500/img/comment.png";
        commentbtn.id = "openPopup";

        commentbtn.addEventListener("click", function () {
          document.getElementById("popupContent").innerHTML = "";

          let commentBox = document.createElement("div");
          commentBox.classList.add("commentBox");
          element.comments.forEach((comment) => {
            let container = document.createElement("div");
            container.classList.add("comment");
            let username = document.createElement("div");
            username.classList.add("username");
            username.innerText = comment.authorName;
            let reply = document.createElement("div");
            reply.innerText = comment.text;
            reply.classList.add("reply");

            container.appendChild(username);
            container.appendChild(reply);
            commentBox.appendChild(container);
          });
          //Creaet new Reply Box
          let replyBox = document.createElement("div");
          replyBox.classList.add("replyBox");
          let username = document.createElement("div");
          username.classList.add("username");
          username.textContent = authorData.username;
          let replyInput = document.createElement("input");
          replyInput.type = "text";
          replyInput.id = "replyInput";
          replyInput.placeholder = "Reply to Blog...";
          replyBox.appendChild(username);
          replyBox.appendChild(replyInput);

          // Create new controls for this post
          let controls = document.createElement("div");
          controls.classList.add("controls");
          let closeBtn = document.createElement("button");
          closeBtn.classList.add("closeBtn");
          closeBtn.textContent = "Close";
          let submitBtn = document.createElement("button");
          submitBtn.classList.add("submitBtn");
          submitBtn.textContent = "Submit";
          submitBtn.addEventListener("click", function () {
            sendComment(element.id);
          });
          controls.appendChild(closeBtn);
          controls.appendChild(submitBtn);

          popupContent.appendChild(commentBox);
          popupContent.appendChild(replyBox);
          popupContent.appendChild(controls);

          let openPopup = createPopup("#popup", commentBox, controls);
          openPopup();
        });

        let isSaved = false;

        for (var i = 0; i < accountIdSavedPosts[0].length; i++) {
          if (accountIdSavedPosts[0][i].id === element.id) {
            isSaved = true;
            break;
          } else {
            isSaved = false;
          }
        }

        let savebtn = document.createElement("img");
        if (isSaved == true) {
          savebtn.src = "http://127.0.0.1:5500/img/saved.png";
        } else {
          savebtn.src = "http://127.0.0.1:5500/img/save.png";
        }
        savebtn.alt = "";
        savebtn.id = `save${element.id}`;

        bottomline.appendChild(likes);
        bottomline.appendChild(likebtn);
        bottomline.appendChild(commentbtn);
        bottomline.appendChild(savebtn);
        post.appendChild(bottomline);

        postContainer.appendChild(post);

        document.getElementById(`like${element.id}`).onclick = function () {
          likePost(element.id);
        };

        document.getElementById(`save${element.id}`).onclick = function () {
          savePost(element.id);
        };
      }
    });
}

function CalculatePublishedDifference(published) {
  let publishedDate = new Date(published);

  let publishedDifference = dateTimeNow - publishedDate;
  let publishedDifferenceSeconds = publishedDifference / 1000;
  let publishedDifferenceMinutes = publishedDifferenceSeconds / 60;
  let publishedDifferenceHours = publishedDifferenceMinutes / 60;
  let publishedDifferenceDays = publishedDifferenceHours / 24;

  if (publishedDifferenceHours < 1) {
    publishedFinal = `${Math.floor(publishedDifferenceMinutes)} Min.`;
  }

  if (publishedDifferenceHours >= 24) {
    publishedFinal = `${Math.floor(publishedDifferenceDays)} Days`;
  }

  if (publishedDifferenceHours >= 1) {
    publishedFinal = `${Math.floor(publishedDifferenceHours)} Std.`;
  }
}

async function sendComment(id) {
  let text = document.getElementById("replyInput").value;

  try {
    const response = await fetch(
      `https://blogchainapi.onrender.com/api/Post/AddComment?postId=${id}&text=${encodeURIComponent(
        text
      )}`,
      {
        method: "PATCH",
        headers: {
          Authorization: jwt,
          "content-type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    window.location.reload();
  } catch (error) {
    console.error("Error sending comment:", error);
  }
}
