import {
    likePost,
    savePost
} from "./postInteractions.js"

var jwt = sessionStorage.getItem("token");
const postContainer = document.getElementById("postContainer");
var accountId = "";
var accountIdSavedPosts = [];

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
        accountIdSavedPosts.push(data.savedPosts);
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
                    username.innerHTML = authorData.profileImage;
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

                    commentbtn.addEventListener("click", function() {
                        
                        document.getElementById("popupContent").innerHTML = '';
                    
                        let commentBox = document.createElement("div");
                        commentBox.classList.add("commentBox");
                        element.comments.forEach(comment => {
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
                        replyInput.placeholder = "Reply to Blog..."
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
                        submitBtn.addEventListener("click",  function() {
                            sendComment(element.id);
                        })
                        controls.appendChild(closeBtn);
                        controls.appendChild(submitBtn);
                    
                        
                        popupContent.appendChild(commentBox);
                        popupContent.appendChild(replyBox);
                        popupContent.appendChild(controls);
                        
                        let openPopup = createPopup("#popup", commentBox, controls);
                        openPopup();
                    });
                    
                    console.log(accountIdSavedPosts[0])
                    let savebtn = document.createElement("img");
                    if (accountIdSavedPosts.includes(element.id)) {
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


    async function sendComment(id) {
        let text = document.getElementById("replyInput").value;
    
        try {
            const response = await fetch(`https://blogchainapi.onrender.com/api/Post/AddComment?postId=${id}&text=${encodeURIComponent(text)}`, {
                method: "PATCH",
                headers: {
                    "Authorization": jwt,
                    "content-type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            window.location.reload();
        } catch (error) {
            console.error("Error sending comment:", error);
        }
    }
    
