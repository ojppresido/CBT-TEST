// CBT Exam Application - Robust functionality with proper error handling

class CBTExamApp {
    constructor() {
        this.currentScreen = 'login-screen';
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes in seconds
        this.timerInterval = null;
        this.questions = [
            {
                id: 1,
                question: "What is the capital of France?",
                options: [
                    { id: 'A', text: "London" },
                    { id: 'B', text: "Berlin" },
                    { id: 'C', text: "Paris" },
                    { id: 'D', text: "Madrid" }
                ],
                correctAnswer: 'C',
                explanation: "Paris is the capital and most populous city of France."
            },
            {
                id: 2,
                question: "Which planet is known as the Red Planet?",
                options: [
                    { id: 'A', text: "Venus" },
                    { id: 'B', text: "Mars" },
                    { id: 'C', text: "Jupiter" },
                    { id: 'D', text: "Saturn" }
                ],
                correctAnswer: 'B',
                explanation: "Mars is known as the Red Planet due to iron oxide (rust) on its surface, giving it a reddish appearance."
            },
            {
                id: 3,
                question: "What is the largest mammal in the world?",
                options: [
                    { id: 'A', text: "Elephant" },
                    { id: 'B', text: "Blue Whale" },
                    { id: 'C', text: "Giraffe" },
                    { id: 'D', text: "Hippopotamus" }
                ],
                correctAnswer: 'B',
                explanation: "The Blue Whale is the largest mammal and the largest animal ever known to have existed, reaching up to 100 feet in length."
            },
            {
                id: 4,
                question: "Which programming language is known as the language of the web?",
                options: [
                    { id: 'A', text: "Python" },
                    { id: 'B', text: "Java" },
                    { id: 'C', text: "JavaScript" },
                    { id: 'D', text: "C++" }
                ],
                correctAnswer: 'C',
                explanation: "JavaScript is known as the language of the web because it runs in web browsers and is essential for creating interactive web pages."
            },
            {
                id: 5,
                question: "What is the chemical symbol for gold?",
                options: [
                    { id: 'A', text: "Go" },
                    { id: 'B', text: "Gd" },
                    { id: 'C', text: "Au" },
                    { id: 'D', text: "Ag" }
                ],
                correctAnswer: 'C',
                explanation: "The chemical symbol for gold is Au, derived from the Latin word 'aurum' meaning gold."
            },
            {
                id: 6,
                question: "Who painted the Mona Lisa?",
                options: [
                    { id: 'A', text: "Vincent van Gogh" },
                    { id: 'B', text: "Pablo Picasso" },
                    { id: 'C', text: "Leonardo da Vinci" },
                    { id: 'D', text: "Michelangelo" }
                ],
                correctAnswer: 'C',
                explanation: "Leonardo da Vinci painted the Mona Lisa in the early 16th century, and it's now displayed at the Louvre Museum in Paris."
            },
            {
                id: 7,
                question: "What is the smallest prime number?",
                options: [
                    { id: 'A', text: "0" },
                    { id: 'B', text: "1" },
                    { id: 'C', text: "2" },
                    { id: 'D', text: "3" }
                ],
                correctAnswer: 'C',
                explanation: "2 is the smallest prime number. It's also the only even prime number, as all other even numbers are divisible by 2."
            },
            {
                id: 8,
                question: "Which ocean is the largest?",
                options: [
                    { id: 'A', text: "Atlantic Ocean" },
                    { id: 'B', text: "Indian Ocean" },
                    { id: 'C', text: "Arctic Ocean" },
                    { id: 'D', text: "Pacific Ocean" }
                ],
                correctAnswer: 'D',
                explanation: "The Pacific Ocean is the largest and deepest ocean, covering about 46% of Earth's water surface and about 32% of its total surface area."
            },
            {
                id: 9,
                question: "What is the main component of the Sun?",
                options: [
                    { id: 'A', text: "Helium" },
                    { id: 'B', text: "Hydrogen" },
                    { id: 'C', text: "Oxygen" },
                    { id: 'D', text: "Carbon" }
                ],
                correctAnswer: 'B',
                explanation: "The Sun is composed of about 74% hydrogen and 24% helium by mass, with hydrogen being the primary component used in nuclear fusion reactions."
            },
            {
                id: 10,
                question: "Which country is known as the Land of the Rising Sun?",
                options: [
                    { id: 'A', text: "China" },
                    { id: 'B', text: "Thailand" },
                    { id: 'C', text: "Japan" },
                    { id: 'D', text: "South Korea" }
                ],
                correctAnswer: 'C',
                explanation: "Japan is known as the Land of the Rising Sun because it is located in the far east in the Pacific Ocean, where the sun rises."
            }
        ];
        
        this.initializeEventListeners();
        this.renderQuestionList();
    }

    initializeEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Start exam button
        const startExamBtn = document.getElementById('start-exam-btn');
        if (startExamBtn) {
            startExamBtn.addEventListener('click', () => {
                this.startExam();
            });
        }

        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousQuestion();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitExam();
            });
        }

        // Restart button
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartExam();
            });
        }
    }

    handleLogin() {
        const studentId = document.getElementById('student-id').value.trim();
        const examCode = document.getElementById('exam-code').value.trim();

        // Basic validation
        if (!studentId || !examCode) {
            alert('Please enter both Student ID and Exam Code');
            return;
        }

        // Simulate login validation
        if (studentId.length < 3) {
            alert('Student ID must be at least 3 characters long');
            return;
        }

        if (examCode.length < 4) {
            alert('Exam Code must be at least 4 characters long');
            return;
        }

        // If validation passes, show instructions screen
        this.showScreen('instructions-screen');
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show the requested screen
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;
        } else {
            console.error(`Screen ${screenId} not found`);
        }
    }

    startExam() {
        this.showScreen('exam-screen');
        this.startTimer();
        this.loadQuestion(this.currentQuestionIndex);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.examTime--;
            
            if (this.examTime <= 0) {
                this.endExam();
                return;
            }
            
            this.updateTimerDisplay();
            
            // Add warning class when time is running low (last 5 minutes)
            if (this.examTime <= 300) { // 5 minutes
                document.getElementById('timer').classList.add('warning');
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.examTime / 60);
        const seconds = this.examTime % 60;
        
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) {
            console.error('Invalid question index:', index);
            return;
        }

        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // Update question display
        document.getElementById('q-number').textContent = question.id;
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('current-q').textContent = index + 1;
        document.getElementById('total-q').textContent = this.questions.length;
        
        // Render options
        this.renderOptions(question);
        
        // Update question list highlighting
        this.updateQuestionList();
        
        // Add animation class for smooth transition
        const questionContainer = document.querySelector('.question-body');
        questionContainer.classList.add('question-transition');
        setTimeout(() => {
            questionContainer.classList.remove('question-transition');
        }, 300);
    }

    renderOptions(question) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.dataset.optionId = option.id;
            
            // Check if this option was previously selected
            const isSelected = this.answers[question.id] === option.id;
            if (isSelected) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <input type="radio" id="opt-${question.id}-${option.id}" name="question-${question.id}" 
                    value="${option.id}" ${isSelected ? 'checked' : ''}>
                <label for="opt-${question.id}-${option.id}">${option.id}. ${option.text}</label>
            `;
            
            optionElement.addEventListener('click', () => {
                this.selectOption(question.id, option.id);
            });
            
            optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(questionId, optionId) {
        // Update answers object
        this.answers[questionId] = optionId;
        
        // Update UI to show selected option
        const options = document.querySelectorAll(`.option-item[data-option-id="${optionId}"]`);
        options.forEach(option => {
            option.classList.add('selected');
        });
        
        // Remove selection from other options for this question
        const allOptions = document.querySelectorAll(`.option-item`);
        allOptions.forEach(option => {
            if (option.dataset.optionId !== optionId) {
                option.classList.remove('selected');
            }
        });
        
        // Update question list to show answered state
        this.updateQuestionList();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }
    }

    renderQuestionList() {
        const container = document.getElementById('question-list-container');
        container.innerHTML = '';

        this.questions.forEach((_, index) => {
            const button = document.createElement('button');
            button.className = 'question-btn';
            button.textContent = index + 1;
            button.dataset.index = index;
            
            button.addEventListener('click', () => {
                this.loadQuestion(index);
            });
            
            container.appendChild(button);
        });
    }

    updateQuestionList() {
        const buttons = document.querySelectorAll('.question-btn');
        buttons.forEach((button, index) => {
            button.classList.remove('answered', 'current');
            
            if (this.answers[this.questions[index].id]) {
                button.classList.add('answered');
            }
            
            if (index === this.currentQuestionIndex) {
                button.classList.add('current');
            }
        });
    }

    submitExam() {
        if (confirm('Are you sure you want to submit your exam?')) {
            this.endExam();
        }
    }

    endExam() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Calculate score
        const score = this.calculateScore();
        
        // Show results screen
        this.showResults(score);
    }

    calculateScore() {
        let correct = 0;
        
        this.questions.forEach(question => {
            if (this.answers[question.id] === question.correctAnswer) {
                correct++;
            }
        });
        
        return correct;
    }

    showResults(score) {
        this.showScreen('results-screen');
        
        const totalQuestions = this.questions.length;
        const percentage = Math.round((score / totalQuestions) * 100);
        
        document.getElementById('score-display').textContent = score;
        document.getElementById('total-questions').textContent = totalQuestions;
        document.getElementById('percentage').textContent = percentage;
        
        // Add event listener for review button if it exists
        const reviewBtn = document.getElementById('review-btn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                this.showReview();
            });
        }
    }
    
    showReview() {
        this.currentQuestionIndex = 0;
        this.showScreen('review-screen');
        this.renderReviewQuestion();
        this.updateReviewNavigation();
    }
    
    renderReviewQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const reviewContainer = document.getElementById('review-container');
        
        if (!reviewContainer) return;
        
        const userAnswer = this.answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        let userAnswerText = 'No answer selected';
        if (userAnswer) {
            const option = question.options.find(opt => opt.id === userAnswer);
            if (option) {
                userAnswerText = `${userAnswer}. ${option.text}`;
            }
        }
        
        const correctOption = question.options.find(opt => opt.id === question.correctAnswer);
        const correctAnswerText = correctOption ? `${question.correctAnswer}. ${correctOption.text}` : 'Unknown';
        
        reviewContainer.innerHTML = `
            <div class="review-header">
                <h3>Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</h3>
                <div class="question-status ${isCorrect ? 'correct' : userAnswer ? 'incorrect' : 'unanswered'}">
                    ${isCorrect ? '✓ Correct' : userAnswer ? '✗ Incorrect' : '? Not Answered'}
                </div>
            </div>
            <div class="review-question">
                <h4>${question.question}</h4>
                
                <div class="options-review">
                    ${question.options.map(option => {
                        const isUserSelection = userAnswer === option.id;
                        const isCorrectOption = question.correctAnswer === option.id;
                        
                        let optionClass = 'option-review';
                        if (isCorrectOption) optionClass += ' correct-answer';
                        if (isUserSelection && !isCorrectOption) optionClass += ' user-wrong-answer';
                        if (isUserSelection && isCorrectOption) optionClass += ' user-correct-answer';
                        
                        return `
                            <div class="${optionClass}">
                                <strong>${option.id}.</strong> ${option.text}
                                ${isUserSelection ? ' <span class="user-selection">(Your answer)</span>' : ''}
                                ${isCorrectOption ? ' <span class="correct-indicator">(Correct answer)</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="explanation">
                    <h5>Explanation:</h5>
                    <p>${question.explanation || 'No explanation available.'}</p>
                </div>
            </div>
        `;
    }
    
    updateReviewNavigation() {
        const prevBtn = document.getElementById('review-prev-btn');
        const nextBtn = document.getElementById('review-next-btn');
        const questionCounter = document.getElementById('review-question-counter');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestionIndex === 0;
            prevBtn.onclick = () => {
                if (this.currentQuestionIndex > 0) {
                    this.currentQuestionIndex--;
                    this.renderReviewQuestion();
                    this.updateReviewNavigation();
                }
            };
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
            nextBtn.onclick = () => {
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.currentQuestionIndex++;
                    this.renderReviewQuestion();
                    this.updateReviewNavigation();
                }
            };
        }
        
        if (questionCounter) {
            questionCounter.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;
        }
    }

    restartExam() {
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // Reset to 60 minutes
        
        // Clear timer if it exists
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Update timer display
        this.updateTimerDisplay();
        
        // Remove warning class from timer
        document.getElementById('timer').classList.remove('warning');
        
        // Show login screen again
        this.showScreen('login-screen');
        
        // Clear login form
        document.getElementById('student-id').value = '';
        document.getElementById('exam-code').value = '';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new CBTExamApp();
        window.cbtApp = app; // Make it accessible globally for debugging
    } catch (error) {
        console.error('Error initializing CBT Exam App:', error);
        alert('There was an error initializing the exam application. Please refresh the page.');
    }
});

// Handle page unload to warn user
window.addEventListener('beforeunload', (e) => {
    if (window.cbtApp && window.cbtApp.currentScreen === 'exam-screen') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
        return 'Are you sure you want to leave? Your exam progress will be lost.';
    }
});