import { likePost, savePost } from "./postInteractions.js"

var jwt = sessionStorage.getItem("token");
const postContainer = document.getElementById("postContainer");
var accountId = "";

fetch("https://blogchainapi.onrender.com/api/User/Get-Me", {
  headers: {
    "Authorization": jwt,
    "content-type": "application/json",
    credentials: "same-origin",
},
})
.then((response) => response.json())
.then(data => {
  accountId = data.id;
})

fetch("https://blogchainapi.onrender.com/api/Post/GetAll", {
    headers: {
        "content-type": "application/json",
        credentials: "same-origin",
      },
})
.then((response) => response.json())
.then((json) => {
    json.forEach(element => {

        

        let post = document.createElement("div");
        post.classList.add("post");
        post.id = element.id;
        
        let topline = document.createElement("div");
        topline.classList.add("topLine");
        let profileImg = document.createElement("img");
        profileImg.src = "element.image";
        profileImg.alt = "";
        let username = document.createElement("span");
        username.classList.add("username");
        username.innerHTML = element.username;
        let time = document.createElement("span");
        time.classList.add("time");
        time.innerHTML = element.published;

        topline.appendChild(profileImg);
        topline.appendChild(username);
        topline.appendChild(time);
        post.appendChild(topline);

        let content = document.createElement("div");
        content.classList.add("content");
        let caption = document.createElement("div");
        caption.classList.add("caption");
        caption.innerHTML = element.text;

        content.appendChild(caption);
        post.appendChild(content);

        let bottomline = document.createElement("div");
        bottomline.classList.add("bottomLine");
        let likebtn = document.createElement("img");
        likebtn.src = "http://127.0.0.1:5500/img/like.png";
        likebtn.alt = "";
        likebtn.id = `like${element.id}`;
        let commentbtn = document.createElement("img");
        commentbtn.src = "http://127.0.0.1:5500/img/comment.png";
        commentbtn.alt = "";
        let savebtn = document.createElement("img");
        savebtn.src = "http://127.0.0.1:5500/img/save.png";
        savebtn.alt = "";
        savebtn.id = `save${element.id}`;

        bottomline.appendChild(likebtn);
        bottomline.appendChild(commentbtn);
        bottomline.appendChild(savebtn);
        post.appendChild(bottomline);

        postContainer.appendChild(post);

        document.getElementById(`like${element.id}`).onclick = function() {
            likePost(element.id);
        };

        document.getElementById(`save${element.id}`).onclick = function() {
            savePost(element.id);
        };
    });
})
