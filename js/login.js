let signUpForm = document.getElementById("signUpForm");
let signInForm = document.getElementById("signInForm");

let signUpContainer = document.getElementById("signUp");
let signInContainer = document.getElementById("signIn");

let signUpButton = document.getElementById("switchToSignUp");
let signInButton = document.getElementById("switchToSignIn");

let passwordInput = document.getElementById("passwordInput");
let passwordCheck = document.getElementById("passwordcheck");

let lowerCaseCheck = document.getElementById("lowerCase");
let upperCaseCheck = document.getElementById("upperCase");
let isNumberCheck = document.getElementById("isNumber");

let signUpSubmitBtn = document.getElementById("signUpButton");
let signInSubmitBtn = document.getElementById("signInButton");

let loginInputCheck = document.getElementById("logincheck");

var jwt = sessionStorage.getItem("token");

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

function Register() {
  let emailInput = document.getElementById("emailInput").value;
  let usernameInput = document.getElementById("usernameInput").value;

  fetch("https://blogchainapi.onrender.com/api/User/Register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      credentials: "same-origin",
    },
    body: JSON.stringify({
      username: usernameInput,
      email: emailInput,
      password: passwordInput.value,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      if (data == "A User with this username already exists (╯°□°）╯︵ ┻━┻") {
        document.getElementById("registrationcheck").style.display = "block";
        signUpSubmitBtn.style.marginBottom = "2rem";

        document.getElementById("emailInput").value = "";
        document.getElementById("usernameInput").value = "";
        passwordInput.value = "";

        passwordCheck.style.display = "none";
        signUpSubmitBtn.style.backgroundColor = "rgb(50, 50, 85)";
        signUpSubmitBtn.disabled = true;
      } else {
        signInContainer.classList.remove("inactive");
        signInForm.style.display = "flex";
        signInButton.style.display = "none";
        signUpButton.style.display = "block";
        signUpForm.style.display = "none";
        signUpContainer.style.borderRadius = "5% 200px 150px 5%";
        signUpContainer.classList.add("inactive");
      }
    });
}

function Login() {
  let usernameInput = document.getElementById("usernameLoginInput").value;
  let passwordInput = document.getElementById("passwordLoginInput").value;

  fetch("https://blogchainapi.onrender.com/api/User/Login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      credentials: "same-origin",
    },
    body: JSON.stringify({
      username: usernameInput,
      password: passwordInput,
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      if (data == "Username or Password is wrong (╯°□°）╯︵ ┻━┻") {
        jwt = null;
        loginInputCheck.style.display = "block";
      } else {
        jwt = `Bearer ${data}`;
        sessionStorage.setItem("token", jwt);
        window.location.href = "blogchain.html";
      }
    });
}

function CheckPassword() {
  let value = passwordInput.value;

  let isUpperCase = false;
  let isLowerCase = false;
  let isNumber = false;

  if (value != "") {
    signUpForm.style.marginTop = "3.1rem";
    passwordCheck.style.display = "block";
  } else {
    passwordCheck.style.display = "none";
    signUpForm.style.marginTop = "0rem";
  }

  for (let i = 0; i < value.length; i++) {
    if (value[i] === value[i].toUpperCase() && !isNaN(value[i]) == false) {
      isUpperCase = true;
    } else {
      signUpSubmitBtn.style.backgroundColor = "rgb(50, 50, 85)";
    }

    if (value[i] === value[i].toLowerCase() && !isNaN(value[i]) == false) {
      isLowerCase = true;
    } else {
      signUpSubmitBtn.style.backgroundColor = "rgb(50, 50, 85)";
    }

    if (!isNaN(value[i]) == true) {
      isNumber = true;
    }

    if (isUpperCase == true && isLowerCase == true && isNumber == true) {
      signUpSubmitBtn.style.backgroundColor = "blue";
      signUpSubmitBtn.disabled = false;
    } else {
      signUpSubmitBtn.style.backgroundColor = "rgb(50, 50, 85)";
      signUpSubmitBtn.disabled = true;
    }
  }

  if (isUpperCase == true) {
    upperCaseCheck.style.color = "green";
  } else {
    upperCaseCheck.style.color = "black";
  }

  if (isLowerCase == true) {
    lowerCaseCheck.style.color = "green";
  } else {
    lowerCaseCheck.style.color = "black";
  }

  if (isNumber == true) {
    isNumberCheck.style.color = "green";
  } else {
    isNumberCheck.style.color = "black";
  }
}
