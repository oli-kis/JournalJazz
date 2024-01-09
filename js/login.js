let signUpForm = document.getElementById("signUpForm");
let signInForm = document.getElementById("signInForm");

let signUpContainer = document.getElementById("signUp");
let signInContainer = document.getElementById("signIn");

let signUpButton = document.getElementById("switchToSignUp");
let signInButton = document.getElementById("switchToSignIn");

signUpButton.addEventListener("click", () => {
  signUpContainer.classList.remove("inactive");
  signUpForm.style.display = "flex";
  signUpButton.style.display = "none";
  signInButton.style.display = "block";
  signInForm.style.display = "none";
  signInContainer.style.borderRadius = "200px 5% 5% 150px";
  signInContainer.classList.add("inactive");
});

signInButton.addEventListener("click", () => {
  signInContainer.classList.remove("inactive");
  signInForm.style.display = "flex";
  signInButton.style.display = "none";
  signUpButton.style.display = "block";
  signUpForm.style.display = "none";
  signUpContainer.style.borderRadius = "5% 200px 150px 5%";
  signUpContainer.classList.add("inactive");
});

if (signUpContainer.classList.contains("inactive")) {
  signUpForm.style.display = "none";
  signUpContainer.style.borderRadius = "5% 200px 150px 5%";
  signInButton.style.display = "none";
}

if (signInContainer.classList.contains("inactive")) {
  signUpButton.style.display = "none";
  signInForm.style.display = "none";
  signInContainer.style.borderRadius = "200px 5% 5% 150px";
}
