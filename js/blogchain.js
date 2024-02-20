import { likePost, savePost } from "./postInteractions.js"

var jwt = sessionStorage.getItem("token");
const postContainer = document.getElementById("postContainer");
var accountId = "";
var accountIdSavedPosts = [];

await fetch("https://blogchainapi.onrender.com/api/User/Get-Me", {
  headers: {
    "Authorization": jwt,
    "content-type": "application/json",
    credentials: "same-origin",
},
})
.then((response) => response.json())
.then(data => {
    accountId = data.id;
    accountIdSavedPosts.push(data.savedPosts);

    console.log(accountIdSavedPosts);
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
        console.log(element)

        fetch(`https://blogchainapi.onrender.com/api/User/GetProfile?id=${element.authorId}`, {
            headers: {
                "content-type": "application/json",
                credentials: "same-origin",
            }
        })
        .then((response) => response.json())
        .then(authorData => {

            let post = document.createElement("div");
            post.classList.add("post");
            post.id = element.id;
            
            let topline = document.createElement("div");
            topline.classList.add("topLine");
            let profileImg = document.createElement("img");
            profileImg.src = authorData.profileImage;
            profileImg.alt = "";
            let username = document.createElement("span");
            username.classList.add("username");
            username.innerHTML = authorData.username;
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

            console.log(element.likedBy)
            console.log(accountId)

            let likebtn = document.createElement("img");
            if(element.likedBy.includes(accountId)) {
                likebtn.src = "http://127.0.0.1:5500/img/likedNew.png";
            } else{
                likebtn.src = "http://127.0.0.1:5500/img/like.png";
            }
            likebtn.alt = "";
            likebtn.id = `like${element.id}`;

            let commentbtn = document.createElement("img");
            commentbtn.src = "http://127.0.0.1:5500/img/comment.png";
            commentbtn.alt = "";

            var isSaved = false;

            for(var i = 0; i < accountIdSavedPosts[0].length; i++) {
                if(accountIdSavedPosts[0][i].id === element.id) {
                    isSaved = true;
                    break;
                } else {
                    isSaved = false;
                }
            }

            let savebtn = document.createElement("img");
            if(isSaved == true) {
                savebtn.src = "http://127.0.0.1:5500/img/saved.png";
            } else {
                savebtn.src = "http://127.0.0.1:5500/img/save.png";
            }
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
        })
    });
})
