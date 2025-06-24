 // DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message"); 
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// Theme Toggle Element
const themeToggle = document.getElementById("theme-toggle");

// Quiz Questions Data
const quizQuestions = [
    {
        question: "What is the capital of Japan?",
        answers: [
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Tokyo", correct: true },
            { text: "Madrid", correct: false },
        ],
    },
    {
        question: "How many days are in a leap year?",
        answers: [
            { text: "435", correct: false },
            { text: "366", correct: true },
            { text: "365", correct: false },
            { text: "378", correct: false },
        ],
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true },
        ],
    },
    {
        question: "What gas do plants absorb from the atmosphere?",
        answers: [
            { text: "Oxygen", correct: false },
            { text: "Nitrogen", correct: false },
            { text: "Helium", correct: false },
            { text: "Carbon Dioxide", correct: true },
        ],
    },
    {
        question: "What is the currency of India?",
        answers: [
            { text: "Euro", correct: false },
            { text: "Yen", correct: false },
            { text: "Rupee", correct: true },
            { text: "Dollar", correct: false },
        ],
    },
];

// QUIZ STATE VARIABLES
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false; 
let shuffledQuestions = []; 
let currentAnswerButtons = []; 

// Initial setup for total questions and max score display
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event Listeners
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);
// Only add event listener if themeToggle element exists
if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}


// Initial theme 
document.addEventListener("DOMContentLoaded", () => {
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeToggle) { 
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; 
        }
    } else {
        if (themeToggle) { 
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; 
        }
    }
});

/**
 * Shuffles an array randomly using the Fisher-Yates algorithm.
 * @param {Array} array The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

/**
 * Initializes and starts the quiz.
 * Resets scores, shuffles questions, and displays the first question.
 */
function startQuiz() {
    // Reset quiz state variables
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0; // Update score display

    // Shuffle questions at the beginning of each quiz session
    shuffledQuestions = shuffleArray([...quizQuestions]); // Create a shallow copy to avoid modifying original

    // Transition from start screen to quiz screen
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    resultScreen.classList.remove("active"); // Ensure result screen is hidden

    showQuestion(); // Display the first question
}

/**
 * Displays the current question and its answers.
 * Handles dynamic creation of answer buttons and progress bar update.
 */
function showQuestion() {
    // Reset state for the new question
    answersDisabled = false; 
    answersContainer.innerHTML = ""; 
   
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    const progressPercent = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";

    // Display the question text
    questionText.textContent = currentQuestion.question;

    currentAnswerButtons = [];

    // Shuffle answers for the current question to randomize their order
    const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

    // Create and append answer buttons
    shuffledAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answer-btn");

        // Store whether the answer is correct using a dataset attribute
        button.dataset.correct = answer.correct;

        // Attach event listener for answer selection
        button.addEventListener("click", selectAnswer);

        // Append button to the answers container and store its reference
        answersContainer.appendChild(button);
        currentAnswerButtons.push(button);
    });
}

/**
 * Handles the user's answer selection.
 * Checks correctness, updates score, provides visual feedback, and moves to the next question.
 * @param {Event} event The click event object.
 */
function selectAnswer(event) {
    // Prevent multiple clicks while an answer is being processed
    if (answersDisabled) return;

    answersDisabled = true; // Disable answers immediately

    const selectedButton = event.target;
    // Determine if the selected answer is correct based on its dataset
    const isCorrect = selectedButton.dataset.correct === "true";

    // Disable all answer buttons visually and remove their event listeners
    currentAnswerButtons.forEach(button => {
        button.removeEventListener("click", selectAnswer); 
        button.disabled = true; 
        button.style.cursor = 'not-allowed'; 
    });

    // Provide visual feedback: highlight correct/incorrect answers
    Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else if (button === selectedButton) {
            button.classList.add("incorrect");
        }
    });

    // Update score if the answer was correct
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score; // Update score display
    }
    setTimeout(() => {
        currentQuestionIndex++; 

        // Update progress bar to reflect transition to next question/quiz end
        const nextProgressPercent = (currentQuestionIndex / shuffledQuestions.length) * 100;
        progressBar.style.width = nextProgressPercent + "%";

        // Check if there are more questions or if the quiz is finished
        if (currentQuestionIndex < shuffledQuestions.length) {
            showQuestion(); 
        } else {
            showResults(); 
        }
    }, 1000);
}

function showResults() {
    // Transition from quiz screen to result screen
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScoreSpan.textContent = score; 

    // Calculate percentage score
    const percentage = (score / quizQuestions.length) * 100;

    // Remove any previous result message classes
    resultMessage.classList.remove(
        "text-green-600",
        "text-purple-600",
        "text-blue-600",
        "text-yellow-600",
        "text-red-600"
    );

    // Set result message based on performance
    if (percentage === 100) {
        resultMessage.textContent = "🥳 Perfect! You're a genius!";
        resultMessage.classList.add("text-green-600");
    } else if (percentage >= 80) {
        resultMessage.textContent = "🌟 Great job! You know your stuff!";
        resultMessage.classList.add("text-purple-600");
    } else if (percentage >= 60) {
        resultMessage.textContent = "👍 Good effort! Keep learning!";
        resultMessage.classList.add("text-blue-600");
    } else if (percentage >= 40) {
        resultMessage.textContent = "🤔 Not bad! Try again to improve!";
        resultMessage.classList.add("text-yellow-600");
    } else {
        resultMessage.textContent = "📚 Keep studying! You'll get better!";
        resultMessage.classList.add("text-red-600");
    }
}


function restartQuiz() {
    resultScreen.classList.remove("active");
    startQuiz(); 
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");

    // Save theme preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Change icon based on the new theme state
    if (themeToggle) { 
        themeToggle.innerHTML = isDarkMode
            ? '<i class="fas fa-sun"></i>' // Sun icon for dark mode
            : '<i class="fas fa-moon"></i>'; // Moon icon for light mode
    }
   
    if (themeToggle) { 
        themeToggle.classList.add("theme-toggle-animate");
        setTimeout(() => {
            themeToggle.classList.remove("theme-toggle-animate");
        }, 300);
    }
}