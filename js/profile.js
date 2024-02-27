import { LikePost, SavePost } from "./postInteractions.js";

var jwt = sessionStorage.getItem("token");
let accountId = "";
let accountIdSavedPosts = [];
let dateTimeNow = new Date();
let publishedFinal;
SetProfile();

async function SetProfile() {
  let userData = await UserData();

  accountId = userData.id;
  accountIdSavedPosts.push(userData.savedPosts);

  const username = document.getElementById("username");
  username.textContent = userData.username;

  const bio = document.getElementById("bio");
  bio.textContent = userData.profileDescription;

  const profileImage = document.getElementById("profileImage");
  profileImage.src = "data:image/png;base64," + userData.profileImage;

  const userImage = document.getElementById("userImage");
  userImage.src = "data:image/png;base64," + userData.profileImage;

  let posts = await GetOwn();

  await CreateBlogs(posts, userData);
}

async function GetOwn() {
  let posts = await fetch(
    `https://blogchainapi.onrender.com/api/Post/GetMyPosts`,
    {
      headers: {
        "content-type": "application/json",
        credentials: "same-origin",
        Authorization: jwt,
      },
    }
  ).then((response) => response.json());
  return posts;
}

async function CreateBlogs(list, user) {
  const postContainer = document.getElementById("posts");
  let accountIdSavedPosts = [];
  list = list.reverse();
  console.log(list);
  for (let x = 0; x < list.length; x++) {
    const element = list[x];
    await fetch(
      `https://blogchainapi.onrender.com/api/User/GetProfile?id=${element.authorId}`,
      {
        headers: {
          "content-type": "application/json",
          credentials: "same-origin",
        },
      }
    )
      .then((response) => response.json())
      .then((authorData) => {
        //Create a new Post-Box
        let post = document.createElement("div");
        post.classList.add("post");
        post.id = element.id;

        //Create the topline for a Post-Box
        let topline = document.createElement("div");
        topline.classList.add("topLine");
        let profileImg = document.createElement("img");
        profileImg.src = "data:image/png;base64," + authorData.profileImage;
        profileImg.alt = "";
        let username = document.createElement("span");
        username.classList.add("username");
        username.innerHTML = authorData.username;

        //Calculate the time-difference between published and now
        CalculatePublishedDifference(element.published);

        let time = document.createElement("span");
        time.classList.add("time");
        time.innerHTML = publishedFinal;

        //Displays amount of people who liked the post
        console.log(element);
        const likes = document.createElement("p");
        let heartAmount = element.likedBy.length;
        likes.textContent = heartAmount;
        likes.className = "likeamount";

        topline.appendChild(profileImg);
        topline.appendChild(username);
        topline.appendChild(time);
        post.appendChild(topline);

        //Displays the content of a post
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
        if (element.likedBy.includes(user.id)) {
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
            console.log(comment);
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

        postContainer.appendChild(post)
        
        //function for liking a post
        document.getElementById(`like${element.id}`).onclick = function () {
          LikePost(element.id);
        };

        //function for saving a post
        document.getElementById(`save${element.id}`).onclick = function () {
          SavePost(element.id);
        };
      });
  });
}

function DisplaySavedPosts() {
  const postContainer = document.getElementById("posts");

  fetch("https://blogchainapi.onrender.com/api/Post/GetAll", {
    headers: {
      "content-type": "application/json",
      credentials: "same-origin",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const sortedPosts = json.sort(
        (a, b) => new Date(b.published) - new Date(a.published)
      );
      sortedPosts.forEach((element) => {
        fetch(
          `https://blogchainapi.onrender.com/api/User/GetProfile?id=${element.authorId}`,
          {
            headers: {
              "content-type": "application/json",
              credentials: "same-origin",
            },
          }
        )
          .then((response) => response.json())
          .then((authorData) => {
            //Create a new Post-Box
            let post = document.createElement("div");
            post.classList.add("post");
            post.id = element.id;

            //Create the topline for a Post-Box
            let topline = document.createElement("div");
            topline.classList.add("topLine");
            let profileImg = document.createElement("img");
            profileImg.src = "data:image/png;base64," + authorData.profileImage;
            profileImg.alt = "";
            let username = document.createElement("span");
            username.classList.add("username");
            username.innerHTML = authorData.username;

            //Calculate the time-difference between published and now
            CalculatePublishedDifference(element.published);

            let time = document.createElement("span");
            time.classList.add("time");
            time.innerHTML = publishedFinal;

            //Displays amount of people who liked the post
            const likes = document.createElement("p");
            let heartAmount = element.likedBy.length;
            likes.textContent = heartAmount;
            likes.className = "likeamount";

            topline.appendChild(profileImg);
            topline.appendChild(username);
            topline.appendChild(time);
            post.appendChild(topline);

            //Displays the content of a post
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

            if(isSaved == true) {
              postContainer.appendChild(post);
            }

            //function for liking a post
            document.getElementById(`like${element.id}`).onclick = function () {
              LikePost(element.id);
            };

            //function for saving a post
            document.getElementById(`save${element.id}`).onclick = function () {
              SavePost(element.id);
            };
          });
      });
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

document.addEventListener("DOMContentLoaded", function () {
  const leftMenu = document.querySelector(".leftMenu");
  const rightMenu = document.querySelector(".rightMenu");

  function toggleMenu(activeMenu) {
    leftMenu.classList.remove("activeMenu");
    rightMenu.classList.remove("activeMenu");
    activeMenu.classList.add("activeMenu");
  }

  leftMenu.addEventListener('click', function() {
      toggleMenu(leftMenu);
      location.reload();
  });

  rightMenu.addEventListener('click', function() {
      toggleMenu(rightMenu);
      document.getElementById("postsContainer").innerHTML = "";
      DisplaySavedPosts();
  });
});
