const passInput = document.getElementById("passInput");
const passResult = document.getElementById("passResult");
const submitBtn = document.getElementById("submitBtn");

const userYear = document.getElementById("userYear");
const ageResult = document.getElementById("ageResult");
const calculateBtn = document.getElementById("calculateBtn");
const currentYear = 2026;

function passwordChecker() {
    return function () {
        const password = passInput.value.trim();

        if (password.length < 8) {
            passResult.textContent = "Parol kamida 8 ta belgidan iborat bo'lishi kerak";
            passResult.style.color = "red";
            return;
        }

        if (password.includes("123")) {
            passResult.textContent = "Parol xavfsiz emas, 123 raqamlarini o'z ichiga olmasligi kerak";
            passResult.style.color = "red";
            return;
        }

        passResult.textContent = "Xavfsiz parol";
        passResult.style.color = "green";
    };
}

function ageCalculator() {

    return function () {
        const birthYear = Number(userYear.value);

        if (!userYear.value || Number.isNaN(birthYear)) {
            ageResult.textContent = "Tug'ilgan yilni kiriting";
            ageResult.style.color = "red";
            return;
        }

        const age = currentYear - birthYear;

        if (age > 18) {
            ageResult.textContent = `Siz ${age} yoshdasiz. Xush kelibsiz`;
            ageResult.style.color = "green";
            return;
        }

        ageResult.textContent = `Siz ${age} yoshdasiz. Sizga kirish mumkin emas`;
        ageResult.style.color = "red";
    };
}

const checkPassword = passwordChecker();
const calculateAge = ageCalculator();

submitBtn.addEventListener("click", checkPassword);
calculateBtn.addEventListener("click", calculateAge);
