const form = document.getElementById("signupForm");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

const usernameField = document.getElementById("usernameField");
const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function setFieldState(field, errorElement, isValid, message) {
    field.classList.toggle("valid", isValid);
    field.classList.toggle("invalid", !isValid);
    errorElement.textContent = isValid ? "" : message;
}

function isEmailValid(value) {
    if (!value.includes("@")) {
        return false;
    }

    const parts = value.split("@");

    if (parts.length !== 2) {
        return false;
    }

    const [name, domain] = parts;

    if (!name || !domain || !domain.includes(".")) {
        return false;
    }

    return domain.split(".").every((part) => part.trim() !== "");
}

function validateUsername() {
    const value = username.value.trim();
    const isValid = value !== "";

    setFieldState(usernameField, usernameError, isValid, "Username cannot be blank");
    return isValid;
}

function validateEmail() {
    const value = email.value.trim();

    if (value === "") {
        setFieldState(emailField, emailError, false, "Email cannot be blank");
        return false;
    } else{
        setFieldState(emailField, emailError, true, "Email");

    }

    const isValid = isEmailValid(value);
    const message = isValid ? "" : "Enter a valid email address";

    setFieldState(emailField, emailError, isValid, message);
    return isValid;
}

function validatePassword() {
    const value = password.value.trim();
    const isValid = value !== "";

    setFieldState(passwordField, passwordError, isValid, "Password cannot be blank");
    return isValid;
}

username.addEventListener("input", validateUsername);
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    validateUsername();
    validateEmail();
    validatePassword();
});

validateUsername();
validateEmail();
validatePassword();
 
