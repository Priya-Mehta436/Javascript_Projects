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
        let answersDisabled = false; // Flag to prevent multiple clicks on answers
        let shuffledQuestions = []; // To store shuffled questions for each quiz instance
        let currentAnswerButtons = []; // To store references to answer buttons for the current question

        // Initial setup for total questions and max score display
        totalQuestionsSpan.textContent = quizQuestions.length;
        maxScoreSpan.textContent = quizQuestions.length;

        // Event Listeners
        startButton.addEventListener("click", startQuiz);
        restartButton.addEventListener("click", restartQuiz);
        themeToggle.addEventListener("click", toggleTheme);

        // Initial theme setup on page load
        document.addEventListener("DOMContentLoaded", () => {
            // Check local storage for theme preference
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark") {
                document.body.classList.add("dark");
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Set sun icon for dark mode
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Set moon icon for light mode
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

            showQuestion(); // Display the first question
        }

        /**
         * Displays the current question and its answers.
         * Handles dynamic creation of answer buttons and progress bar update.
         */
        function showQuestion() {
            // Reset state for the new question
            answersDisabled = false; // Enable answers for the new question
            answersContainer.innerHTML = ""; // Clear previously displayed answers

            // Get the current question from the shuffled array
            const currentQuestion = shuffledQuestions[currentQuestionIndex];

            // Update question counter display
            currentQuestionSpan.textContent = currentQuestionIndex + 1;

            // Calculate and update the progress bar width.
            // The bar shows progress *before* answering the current question.
            const progressPercent = (currentQuestionIndex / shuffledQuestions.length) * 100;
            progressBar.style.width = progressPercent + "%";

            // Display the question text
            questionText.textContent = currentQuestion.question;

            currentAnswerButtons = []; // Clear array to store new buttons

            // Shuffle answers for the current question to randomize their order
            const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

            // Create and append answer buttons
            shuffledAnswers.forEach((answer) => {
                const button = document.createElement("button");
                button.textContent = answer.text;
                // Removed Tailwind classes for styling, as requested
                button.classList.add("answer-btn"); // Retain this class for JS targeting if needed later

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
                button.removeEventListener("click", selectAnswer); // Remove listener to prevent re-selection
                button.disabled = true; // Make buttons unclickable
                button.style.cursor = 'not-allowed'; // Change cursor to indicate disabled state
            });

            // Provide visual feedback: highlight correct/incorrect answers
            Array.from(answersContainer.children).forEach((button) => {
                if (button.dataset.correct === "true") {
                    button.classList.add("correct"); // Removed Tailwind ring classes
                } else if (button === selectedButton) {
                    button.classList.add("incorrect"); // Removed Tailwind ring classes
                }
            });

            // Update score if the answer was correct
            if (isCorrect) {
                score++;
                scoreSpan.textContent = score; // Update score display
            }

            // Wait for 1 second before moving to the next question or showing results
            setTimeout(() => {
                currentQuestionIndex++; // Increment question index

                // Update progress bar to reflect transition to next question/quiz end
                const nextProgressPercent = (currentQuestionIndex / shuffledQuestions.length) * 100;
                progressBar.style.width = nextProgressPercent + "%";

                // Check if there are more questions or if the quiz is finished
                if (currentQuestionIndex < shuffledQuestions.length) {
                    showQuestion(); // Show the next question
                } else {
                    showResults(); // End of quiz, show results
                }
            }, 1000); // 1 second delay
        }

        function showResults() {
            // Transition from quiz screen to result screen
            quizScreen.classList.remove("active");
            resultScreen.classList.add("active");

            finalScoreSpan.textContent = score; // Display final score

            // Calculate percentage score
            const percentage = (score / quizQuestions.length) * 100;

            // Set result message based on performance
            if (percentage === 100) {
                resultMessage.textContent = "🥳 Perfect! You're a genius!";
                resultMessage.classList.remove("text-blue-600", "dark:text-indigo-400"); // Removed Tailwind classes
                resultMessage.classList.add("text-green-600"); // Using a generic class
            } else if (percentage >= 80) {
                resultMessage.textContent = "🌟 Great job! You know your stuff!";
                resultMessage.classList.remove("text-blue-600", "dark:text-indigo-400");
                resultMessage.classList.add("text-purple-600");
            } else if (percentage >= 60) {
                resultMessage.textContent = "👍 Good effort! Keep learning!";
                resultMessage.classList.remove("text-blue-600", "dark:text-indigo-400");
                resultMessage.classList.add("text-blue-600");
            } else if (percentage >= 40) {
                resultMessage.textContent = "🤔 Not bad! Try again to improve!";
                resultMessage.classList.remove("text-blue-600", "dark:text-indigo-400");
                resultMessage.classList.add("text-yellow-600");
            } else {
                resultMessage.textContent = "📚 Keep studying! You'll get better!";
                resultMessage.classList.remove("text-blue-600", "dark:text-indigo-400");
                resultMessage.classList.add("text-red-600");
            }
        }

        
        function restartQuiz() {
            resultScreen.classList.remove("active");
            startQuiz(); // Call startQuiz to reset and begin a new game
        }
        function toggleTheme() {
            document.body.classList.toggle("dark");
            const isDarkMode = document.body.classList.contains("dark");

            // Save theme preference to localStorage
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");

            // Change icon based on the new theme state
            themeToggle.innerHTML = isDarkMode
                ? '<i class="fas fa-sun"></i>' // Sun icon for dark mode
                : '<i class="fas fa-moon"></i>'; // Moon icon for light mode

            // Add animation class for a brief visual effect, then remove it
            themeToggle.classList.add("theme-toggle-animate");
            setTimeout(() => {
                themeToggle.classList.remove("theme-toggle-animate");
            }, 300);
        }