const POINTS_PER_QUESTION = 10;
const TIME_PER_QUESTION = 15;

const questions = [
  {
    question: "JavaScript'da o'zgaruvchi e'lon qilishning to'g'ri usuli qaysi?",
    options: ["variable x = 5", "let x = 5", "x := 5", "int x = 5"],
    answer: 1
  },
  {
    question: "`typeof null` nima qaytaradi?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    answer: 2
  },
  {
    question: "Quyidagilardan qaysi biri false qaytaradi?",
    options: ["Boolean('0')", "Boolean([])", "Boolean(0)", "Boolean(' ')"],
    answer: 2
  },
  {
    question: "`let` va `var` o'rtasidagi asosiy farq nima?",
    options: [
      "`let` faqat raqamlar uchun",
      "`let` block-scoped, `var` function-scoped",
      "`var` zamonaviy, `let` eski",
      "Hech qanday farq yo'q"
    ],
    answer: 1
  },
  {
    question: "`'5' + 3` ifodasi nima qaytaradi?",
    options: ["8", "'53'", "53", "Error"],
    answer: 1
  },
  {
    question: "Massivning oxirgi elementini olib tashlash uchun qaysi metod ishlatiladi?",
    options: ["shift()", "unshift()", "pop()", "splice()"],
    answer: 2
  },
  {
    question: "`===` va `==` o'rtasidagi farq nima?",
    options: [
      "Hech qanday farq yo'q",
      "`===` faqat stringlar uchun",
      "`===` qiymat va turni tekshiradi, `==` faqat qiymatni",
      "`==` qiymat va turni tekshiradi"
    ],
    answer: 2
  },
  {
    question: "Quyidagi kod nima chiqaradi?\n`console.log(2 ** 3)`",
    options: ["6", "8", "9", "Error"],
    answer: 1
  },
  {
    question: "`const` bilan e'lon qilingan obyektning xususiyatini o'zgartirish mumkinmi?",
    options: [
      "Yo'q, umuman o'zgartirib bo'lmaydi",
      "Ha, xususiyatlarni o'zgartirish mumkin",
      "Faqat raqam xususiyatlarini",
      "Faqat string xususiyatlarini"
    ],
    answer: 1
  },
  {
    question: "DOM'da element matnini o'zgartirish uchun qaysi xossa ishlatiladi?",
    options: [
      "element.value",
      "element.innerHTML",
      "element.textContent",
      "element.className"
    ],
    answer: 2
  }
];

let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;
let userAnswers = [];
let isLocked = false;

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");

const progressBar = document.getElementById("progressBar");
const questionCounter = document.getElementById("questionCounter");
const timerBadge = document.getElementById("timerBadge");
const scoreDisplay = document.getElementById("scoreDisplay");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");

const resultEmoji = document.getElementById("resultEmoji");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const finalScore = document.getElementById("finalScore");
const correctCountElement = document.getElementById("correctCount");
const wrongCountElement = document.getElementById("wrongCount");
const reviewList = document.getElementById("reviewList");

function showScreen(activeScreen) {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  activeScreen.classList.remove("hidden");
}

function updateScore() {
  scoreDisplay.textContent = `Ball: ${score}`;
}

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateTimer() {
  timerBadge.textContent = `${timeLeft}s`;
  timerBadge.classList.toggle("urgent", timeLeft <= 5);
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  timeLeft = TIME_PER_QUESTION;
  userAnswers = [];
  isLocked = false;
  clearInterval(timerInterval);
  updateScore();
  updateTimer();
  progressBar.style.width = "0%";
}

function startQuiz() {
  resetQuiz();
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  isLocked = false;
  timeLeft = TIME_PER_QUESTION;
  updateProgress();
  updateTimer();

  questionCounter.textContent = `Savol ${currentQuestionIndex + 1} / ${questions.length}`;
  questionNumber.textContent = String(currentQuestionIndex + 1).padStart(2, "0");
  questionText.innerHTML = currentQuestion.question.replace(/\n/g, "<br>");

  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    const optionLetter = String.fromCharCode(65 + index);

    button.type = "button";
    button.className = "option-btn";
    button.dataset.index = String(index);
    button.innerHTML = `
      <span class="option-letter">${optionLetter}</span>
      <span>${option}</span>
    `;

    optionsContainer.appendChild(button);
  });

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(null);
    }
  }, 1000);
}

function disableOptions() {
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((button) => {
    button.disabled = true;
  });
}

function showCorrectAnswer(correctIndex, selectedIndex) {
  if (selectedIndex === null) {
    return;
  }

  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((button, index) => {
    if (index === correctIndex) {
      button.classList.add("correct");
    }

    if (selectedIndex !== null && index === selectedIndex && index !== correctIndex) {
      button.classList.add("wrong");
    }
  });
}

function handleAnswer(selectedIndex) {
  if (isLocked) {
    return;
  }

  isLocked = true;
  clearInterval(timerInterval);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === currentQuestion.answer;

  userAnswers.push(selectedIndex);

  if (isCorrect) {
    score += POINTS_PER_QUESTION;
    correctCount += 1;
  } else {
    wrongCount += 1;
  }

  updateScore();
  disableOptions();
  showCorrectAnswer(currentQuestion.answer, selectedIndex);

  setTimeout(() => {
    currentQuestionIndex += 1;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      return;
    }

    showResults();
  }, 900);
}

function getResultData() {
  if (score >= 80) {
    return {
      emoji: "A'lo",
      title: "Zo'r natija",
      message: "Siz quizni juda yaxshi ishladingiz."
    };
  }

  if (score >= 50) {
    return {
      emoji: "Yaxshi",
      title: "Yaxshi urinish",
      message: "Asosiy mavzularni bilasiz, yana biroz mashq qilsangiz yanada yaxshi bo'ladi."
    };
  }

  return {
    emoji: "Qayta",
    title: "Yana urinib ko'ring",
    message: "Natija pastroq bo'ldi. Savollarni yana bir marta ishlab chiqing."
  };
}

function renderReview() {
  reviewList.innerHTML = "";

  questions.forEach((question, index) => {
    const userAnswerIndex = userAnswers[index];
    const isCorrect = userAnswerIndex === question.answer;
    const userAnswerText =
      userAnswerIndex == null ? "Javob berilmadi" : question.options[userAnswerIndex];

    const item = document.createElement("li");
    item.className = `review-item ${isCorrect ? "correct-item" : "wrong-item"}`;
    item.innerHTML = `
      <p class="review-q">${index + 1}. ${question.question}</p>
      <p class="review-a">Sizning javobingiz: ${userAnswerText}</p>
      ${isCorrect ? "" : `<p class="review-a">To'g'ri javob: ${question.options[question.answer]}</p>`}
    `;

    reviewList.appendChild(item);
  });
}

function showResults() {
  clearInterval(timerInterval);
  progressBar.style.width = "100%";

  const resultData = getResultData();

  resultEmoji.textContent = resultData.emoji;
  resultTitle.textContent = resultData.title;
  resultMessage.textContent = resultData.message;
  finalScore.textContent = String(score);
  correctCountElement.textContent = String(correctCount);
  wrongCountElement.textContent = String(wrongCount);

  renderReview();
  showScreen(resultScreen);
}

startBtn.addEventListener("click", startQuiz);
retryBtn.addEventListener("click", startQuiz);

optionsContainer.addEventListener("click", (event) => {
  const selectedButton = event.target.closest(".option-btn");

  if (!selectedButton || selectedButton.disabled) {
    return;
  }

  handleAnswer(Number(selectedButton.dataset.index));
});

updateScore();
updateTimer();
