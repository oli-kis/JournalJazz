let like = document.getElementById("like");

like.addEventListener("click", () => {
  if (like.src == "http://127.0.0.1:5500/img/like.png") {
    like.src = "http://127.0.0.1:5500/img/likedNew.png";
  } else {
    like.src = "http://127.0.0.1:5500/img/like.png";
  }
});

let save = document.getElementById("save");

save.addEventListener("click", () => {
  if (save.src == "http://127.0.0.1:5500/img/save.png") {
    save.src = "http://127.0.0.1:5500/img/saved.png";
  } else {
    save.src = "http://127.0.0.1:5500/img/save.png";
  }
});
