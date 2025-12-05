// CBT Exam Application - Robust functionality with proper error handling
// Import database functionality

class CBTExamApp {
    constructor() {
        this.currentScreen = 'login-screen';
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.examTime = 3600; // 60 minutes in seconds for most subjects
        this.timerInterval = null;
        this.questions = [];
        this.selectedSubject = '';
        this.selectedYear = 'jamb_2010'; // Default year
        this.subjects = ['English', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Government', 'Economics', 'Financial_Account'];
        this.years = ['jamb_2010', 'jamb_2011', 'jamb_2012', 'jamb_2013', 'jamb_2014', 'jamb_2015', 'jamb_2016', 'jamb_2017', 'jamb_2018', 'jamb_2019']; // Available years
        
        // Initialize database
        this.initDatabase();
        
        this.initializeEventListeners();
        this.renderSubjectSelection();
        this.renderYearSelection();
    }
    
    async initDatabase() {
        try {
            await examDB.init();
            console.log('Database initialized successfully');
            // Load questions into database if not already present
            this.loadQuestionsToDatabase();
        } catch (error) {
            console.error('Error initializing database:', error);
            // Fallback to JSON file if database fails
            console.log('Falling back to JSON file for questions');
        }
    }
    
    async loadQuestionsToDatabase() {
        // This would load questions from the JSON file to the database
        // For now, we'll just load from the JSON file as before
        // In a production environment, this would populate the database
    }
    
    renderSubjectSelection() {
        const subjectContainer = document.getElementById('subject-container');
        if (!subjectContainer) return;
        
        subjectContainer.innerHTML = '';
        
        this.subjects.forEach(subject => {
            const subjectBtn = document.createElement('button');
            subjectBtn.className = 'subject-btn';
            subjectBtn.textContent = subject.replace('_', ' ');
            subjectBtn.addEventListener('click', () => {
                this.selectedSubject = subject;
                // For English, automatically set year to 2010 since only 2010 questions are available
                if (subject === 'English') {
                    this.selectedYear = 'jamb_2010';
                    this.loadQuestionsForSubject(subject);
                    this.showScreen('exam-screen'); // Go directly to exam screen for English
                } else {
                    this.showScreen('year-selection-screen'); // Show year selection for other subjects
                }
            });
            subjectContainer.appendChild(subjectBtn);
        });
    }
    
    renderYearSelection() {
        const yearContainer = document.getElementById('year-container');
        if (!yearContainer) return;
        
        yearContainer.innerHTML = '';
        
        // Determine which years to show based on subject
        const availableYears = this.selectedSubject === 'English' ? ['jamb_2010'] : this.years;
        
        availableYears.forEach(year => {
            const yearBtn = document.createElement('button');
            yearBtn.className = 'year-btn';
            yearBtn.textContent = year.replace('jamb_', 'JAMB ');
            yearBtn.addEventListener('click', () => {
                this.selectedYear = year;
                this.loadQuestionsForSubject(this.selectedSubject);
            });
            yearContainer.appendChild(yearBtn);
        });
    }
    
    async loadQuestionsForSubject(subject) {
        try {
            // Try to load from database first
            if (examDB && examDB.db) {
                try {
                    this.questions = await examDB.getQuestionsBySubject(subject);
                    if (this.questions.length > 0) {
                        console.log(`Loaded ${this.questions.length} questions from database for ${subject}`);
                        this.selectRandomQuestions(); // Select 10 random questions (or all for English)
                        this.renderQuestionList(); // Initialize the question list after loading questions
                        this.showScreen('login-screen');
                        return;
                    }
                } catch (dbError) {
                    console.error('Error loading questions from database:', dbError);
                    // Continue to fallback method
                }
            }
            
            // Fallback to subject-specific JSON files with year selection
            // Convert subject name to lowercase and replace underscores with hyphens for filename
            // Use the selected year for the filename
            const fileName = `src/data/subjects/${subject.toLowerCase()}_questions_${this.selectedYear}.json`;
            const response = await fetch(fileName);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}: ${response.status} ${response.statusText}`);
            }
            
            const subjectData = await response.json();
            
            if (subjectData) {
                // For English, we need to handle the full data structure with passages and instructions
                if (subject === 'English' && subjectData.questions) {
                    // Store the complete English data structure
                    this.englishData = subjectData;
                    
                    // For English, we'll still use this.questions array but in the correct order
                    // based on passages and instructions structure
                    this.questions = subjectData.questions;
                    
                    // For English, we want to maintain the original question order and IDs
                    console.log(`Loaded ${this.questions.length} English questions with ${subjectData.passages.length} passages and ${subjectData.instructions.length} instructions`);
                } else if (subjectData.questions) {
                    // For other subjects, use questions directly
                    this.questions = subjectData.questions;
                } else {
                    console.error(`Subject ${subject} not found in exams data`);
                    alert(`Questions for ${subject} are not available.`);
                    return;
                }
                
                // Optionally, add questions to database for future use
                if (examDB && examDB.db && subjectData.questions) {
                    try {
                        await examDB.addQuestions(subject, subjectData.questions);
                        console.log(`Added ${subjectData.questions.length} questions to database for ${subject}`);
                    } catch (addError) {
                        console.error('Error adding questions to database:', addError);
                    }
                }
                
                this.selectRandomQuestions(); // Select 10 random questions (or all for English)
                this.renderQuestionList(); // Initialize the question list after loading questions
                this.showScreen('login-screen');
            } else {
                console.error(`Subject ${subject} not found in exams data`);
                alert(`Questions for ${subject} are not available.`);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('There was an error loading the exam questions. Please try again.');
        }
    }

    // Select questions based on subject - for English, use all questions in order with passages and instructions; for others, select random
    selectRandomQuestions() {
        // For English subject, we want to use all questions in the original order
        // following passages and instructions structure
        if (this.selectedSubject === 'English') {
            console.log(`English subject selected - using all ${this.questions.length} questions in original order with passages and instructions`);
            // For English, we will restructure the questions array to include passage and instruction content
            // as special question types that will be displayed in the UI
            if (this.englishData) {
                this.restructureEnglishQuestions();
            }
            return; // Don't modify the questions array for English
        }
        
        // For other subjects, use the random selection as before
        if (this.questions.length <= 10) {
            // If there are 10 or fewer questions, use all of them
            return;
        }
        
        // Create a copy of the questions array to avoid modifying the original
        const allQuestions = [...this.questions];
        const selectedQuestions = [];
        
        // Randomly select 10 questions
        for (let i = 0; i < 10; i++) {
            if (allQuestions.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            selectedQuestions.push(allQuestions[randomIndex]);
            // Remove the selected question to avoid duplicates
            allQuestions.splice(randomIndex, 1);
        }
        
        // Assign new sequential IDs to the selected questions (1 to 10)
        this.questions = selectedQuestions.map((question, index) => {
            return {
                ...question,
                id: index + 1  // Sequential numbering from 1 to 10
            };
        });
        
        console.log(`Selected ${this.questions.length} random questions from original pool with new sequential IDs`);
    }
    
    // Restructure English questions to include passages and instructions in display order
    restructureEnglishQuestions() {
        if (!this.englishData) return;
        
        // Create a new array that includes passages and instructions in the correct order
        const restructuredQuestions = [];
        
        // First, add passages with their corresponding questions
        if (this.englishData.passages) {
            this.englishData.passages.forEach(passage => {
                // Add a special passage content item
                restructuredQuestions.push({
                    id: `passage-${passage.id}`,
                    type: 'passage',
                    title: passage.id,
                    content: passage.text,
                    isPassage: true
                });
                
                // Find and add questions related to this passage
                const passageQuestions = this.questions.filter(q => q.passageId === passage.id);
                passageQuestions.forEach(question => {
                    restructuredQuestions.push({
                        ...question,
                        isPassageQuestion: true
                    });
                });
            });
        }
        
        // Then, add instructions followed by their corresponding questions
        if (this.englishData.instructions) {
            this.englishData.instructions.forEach((instruction, index) => {
                // Add a special instruction content item
                restructuredQuestions.push({
                    id: `instruction-${instruction.id}`,
                    type: 'instruction',
                    title: instruction.id,
                    content: instruction.text,
                    isInstruction: true
                });
                
                // Find and add questions related to this instruction based on question ranges
                // Based on the data structure, questions 26-35 relate to Instruction 1, 36-50 to Instruction 2, etc.
                let startId, endId;
                switch(index + 1) {
                    case 1: startId = 26; endId = 35; break; // Instruction 1: questions 26-35
                    case 2: startId = 36; endId = 50; break; // Instruction 2: questions 36-50
                    case 3: startId = 51; endId = 65; break; // Instruction 3: questions 51-65
                    case 4: startId = 66; endId = 85; break; // Instruction 4: questions 66-85
                    case 5: startId = 86; endId = 88; break; // Instruction 5: questions 86-88
                    case 6: startId = 89; endId = 91; break; // Instruction 6: questions 89-91
                    case 7: startId = 92; endId = 94; break; // Instruction 7: questions 92-94
                    case 8: startId = 95; endId = 97; break; // Instruction 8: questions 95-97
                    case 9: startId = 98; endId = 100; break; // Instruction 9: questions 98-100
                    default: startId = 1; endId = 0; break;
                }

                if (startId && endId) {
                    const instructionQuestions = this.questions.filter(q => 
                        q.id >= startId && q.id <= endId && !q.passageId
                    );
                    
                    instructionQuestions.forEach(question => {
                        restructuredQuestions.push({
                            ...question,
                            isInstructionQuestion: true
                        });
                    });
                }
            });
        }
        
        // Add any remaining questions that weren't associated with passages or instructions
        const allProcessedQuestionIds = new Set(restructuredQuestions.filter(item => !item.isPassage && !item.isInstruction).map(item => item.id));
        this.questions.forEach(question => {
            if (!allProcessedQuestionIds.has(question.id) && !question.passageId) {
                restructuredQuestions.push(question);
            }
        });
        
        this.questions = restructuredQuestions;
        console.log(`Restructured English questions: ${restructuredQuestions.length} items total (including passages and instructions)`);
    }

    // Determine if a question needs a diagram based on keywords
    questionNeedsDiagram(questionText) {
        const diagramKeywords = [
            'chord', 'circle', 'triangle', 'rectangle', 'square', 'polygon', 
            'angle', 'diagram', 'figure', 'graph', 'plot', 'coordinate',
            'geometry', 'trigonometry', 'bearing', 'distance', 'length',
            'area', 'perimeter', 'volume', 'pythagoras', 'theorem',
            'sin', 'cos', 'tan', 'sine', 'cosine', 'tangent',
            'angle of elevation', 'angle of depression',
            'construct', 'draw', 'sketch', 'shape', 'diagram',
            'right-angled', 'isosceles', 'equilateral', 'scalene',
            'parallelogram', 'trapezium', 'rhombus', 'kite',
            'sector', 'arc', 'diameter', 'radius', 'circumference',
            'tangent to', 'chord of', 'segment', 'sector',
            'coordinates of', 'line segment', 'parallel lines',
            'perpendicular', 'bisector', 'midpoint', 'intersection',
            'area of', 'perimeter of', 'volume of', 'surface area',
            'pyramid', 'prism', 'cylinder', 'cone', 'sphere'
        ];
        
        const lowerQuestion = questionText.toLowerCase();
        return diagramKeywords.some(keyword => lowerQuestion.includes(keyword.toLowerCase()));
    }

    // Fetch diagram from centralized file based on question ID
    async fetchDiagramForQuestion(questionId) {
        try {
            const response = await fetch(`/api/diagram/${questionId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const diagramData = await response.json();
            return diagramData;
        } catch (error) {
            console.error(`Error fetching diagram for question ${questionId}:`, error);
            // Return a default response if the API call fails
            return {
                success: true,
                questionId: questionId,
                diagram: null,
                hasDiagram: false
            };
        }
    }

    // Process explanation to extract only one image/diagram
    processExplanationForDiagrams(explanation) {
        // Remove duplicate diagram containers, keeping only the first one
        const diagramContainerRegex = /<div class="diagram-container">[\s\S]*?<\/svg>\s*<\/div>/g;
        const allDiagrams = explanation.match(diagramContainerRegex);
        
        if (allDiagrams && allDiagrams.length > 1) {
            // Keep only the first diagram container and remove the rest
            let firstDiagramFound = false;
            let processedExplanation = explanation.replace(diagramContainerRegex, (match) => {
                if (!firstDiagramFound) {
                    firstDiagramFound = true;
                    return match; // Keep the first diagram
                }
                // Remove subsequent diagrams by returning empty string
                return '';
            });
            
            // Clean up any extra spaces or line breaks left by removed diagrams
            processedExplanation = processedExplanation.replace(/\s*\n\s*\n\s*/g, '\n');
            return processedExplanation.trim();
        }
        
        return explanation;
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
                this.showSubmitConfirmation();
            });
        }

        // Modal buttons
        const confirmSubmitBtn = document.getElementById('confirm-submit');
        const cancelSubmitBtn = document.getElementById('cancel-submit');
        
        if (confirmSubmitBtn) {
            confirmSubmitBtn.addEventListener('click', () => {
                this.endExam();
                this.hideSubmitModal();
            });
        }
        
        if (cancelSubmitBtn) {
            cancelSubmitBtn.addEventListener('click', () => {
                this.hideSubmitModal();
            });
        }

        // Year selection back button
        const yearBackBtn = document.getElementById('year-back-btn');
        if (yearBackBtn) {
            yearBackBtn.addEventListener('click', () => {
                this.showScreen('subject-selection-screen');
            });
        }
        
        // Instructions screen back button
        const instructionsBackBtn = document.getElementById('instructions-back-btn');
        if (instructionsBackBtn) {
            instructionsBackBtn.addEventListener('click', () => {
                this.showScreen('year-selection-screen');
            });
        }
        
        // Restart button
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartExam();
            });
        }
        
        // Review finish button
        const reviewFinishBtn = document.getElementById('review-finish-btn');
        if (reviewFinishBtn) {
            reviewFinishBtn.addEventListener('click', () => {
                this.finishReview();
            });
        }
    }

    showSubmitConfirmation() {
        const modal = document.getElementById('submit-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideSubmitModal() {
        const modal = document.getElementById('submit-modal');
        if (modal) {
            modal.classList.remove('active');
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

        // Clear the form inputs after successful validation to prevent remembering
        document.getElementById('student-id').value = '';
        document.getElementById('exam-code').value = '';

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
        // Adjust exam time based on subject - English has 100 questions so needs more time
        if (this.selectedSubject === 'English') {
            this.examTime = 7200; // 120 minutes for 100 English questions
        } else {
            this.examTime = 3600; // 60 minutes for other subjects
        }
        
        this.showScreen('exam-screen');
        this.startTimer();
        this.currentQuestionIndex = 0; // Reset to first question
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

    async loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) {
            console.error('Invalid question index:', index);
            return;
        }

        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // Check if this is a passage or instruction content item
        if (question.isPassage) {
            // Display passage content
            document.getElementById('q-number').textContent = 'Passage';
            document.getElementById('question-text').innerHTML = `<div class="passage-content"><h3>${question.title}</h3><p>${question.content}</p></div>`;
            document.getElementById('current-q').textContent = index + 1;
            document.getElementById('total-q').textContent = this.questions.length;
            
            // Clear options container for passages
            document.getElementById('options-container').innerHTML = '';
            
            // Update question list highlighting
            this.updateQuestionList();
            
            // Update navigation buttons
            this.updateNavigationButtons();
            
            // Add animation class for smooth transition
            const questionContainer = document.querySelector('.question-body');
            questionContainer.classList.add('question-transition');
            setTimeout(() => {
                questionContainer.classList.remove('question-transition');
            }, 300);
            
            return;
        } else if (question.isInstruction) {
            // Display instruction content
            document.getElementById('q-number').textContent = 'Instruction';
            document.getElementById('question-text').innerHTML = `<div class="instruction-content"><h3>${question.title}</h3><p>${question.content}</p></div>`;
            document.getElementById('current-q').textContent = index + 1;
            document.getElementById('total-q').textContent = this.questions.length;
            
            // Clear options container for instructions
            document.getElementById('options-container').innerHTML = '';
            
            // Update question list highlighting
            this.updateQuestionList();
            
            // Update navigation buttons
            this.updateNavigationButtons();
            
            // Add animation class for smooth transition
            const questionContainer = document.querySelector('.question-body');
            questionContainer.classList.add('question-transition');
            setTimeout(() => {
                questionContainer.classList.remove('question-transition');
            }, 300);
            
            return;
        }
        
        // Handle regular questions
        document.getElementById('q-number').textContent = question.id;
        // Clean up the question text to remove BODMAS references and fix underlines
        let cleanQuestion = question.question.replace(/using BODMAS rule/gi, '');
        cleanQuestion = cleanQuestion.replace(/BODMAS/gi, '');
        
        // Add diagram container if available and question needs it
        let questionHtml = cleanQuestion;
        if (question.diagram && this.questionNeedsDiagram(question.question)) {
            // Check if the question text already contains an SVG diagram
            if (!questionHtml.includes('<svg')) {
                // Decode the diagram data and add it directly to the question
                try {
                    const decodedDiagram = decodeURIComponent(question.diagram);
                    if (decodedDiagram.startsWith('<svg')) {
                        questionHtml += `<div class="diagram-container"><h5>Diagram:</h5>${decodedDiagram}</div>`;
                    } else {
                        questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                    }
                } catch (e) {
                    questionHtml += `<button class="diagram-btn" onclick="showDiagram('${encodeURIComponent(question.diagram)}')">Show Diagram</button>`;
                }
            }
        }
        
        // Fix MathJax delimiters from double backslashes to single backslashes for proper rendering
        const fixedQuestionHtml = questionHtml.replace(/\\\\\\\\\\\\\\(/g, '\\(').replace(/\\\\\\\\\\\\\\)/g, '\\)').replace(/\\\\\\\\\\\\[/g, '\\[').replace(/\\\\\\\\\\\\]/g, '\\]');
        document.getElementById('question-text').innerHTML = fixedQuestionHtml; // Changed to innerHTML to support HTML tags
        document.getElementById('current-q').textContent = index + 1;
        document.getElementById('total-q').textContent = this.questions.length;
        
        // Trigger MathJax to re-render the mathematical expressions
        if (window.MathJax) {
            MathJax.typesetPromise([document.getElementById('question-text')]).then(function() {
                if (typeof typesetMath === 'function') {
                    typesetMath();
                }
            }).catch(function (err) {
                console.error('MathJax error:', err);
            });
        }
        
        // Render options
        this.renderOptions(question);
        
        // Update question list highlighting
        this.updateQuestionList();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
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
            
            // Fix MathJax delimiters in option text before rendering
            const fixedOptionText = option.text.replace(/\\\\\\\\\\\\\\(/g, '\\(').replace(/\\\\\\\\\\\\\\)/g, '\\)').replace(/\\\\\\\\\\\\[/g, '\\[').replace(/\\\\\\\\\\\\]/g, '\\]');
            optionElement.innerHTML = `
                <input type="radio" id="opt-${question.id}-${option.id}" name="question-${question.id}" 
                    value="${option.id}" ${isSelected ? 'checked' : ''}>
                <label for="opt-${question.id}-${option.id}">${option.id}. ${fixedOptionText}</label>
            `;
            
            optionElement.addEventListener('click', () => {
                this.selectOption(question.id, option.id);
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Trigger MathJax to re-render mathematical expressions in the options
        if (window.MathJax) {
            MathJax.typesetPromise([optionsContainer]).then(function() {
                if (typeof typesetMath === 'function') {
                    typesetMath();
                }
            }).catch(function (err) {
                console.error('MathJax error in options:', err);
            });
        }
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
    
    updateNavigationButtons() {
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (nextBtn) {
            // Disable next button if on the last question
            nextBtn.disabled = this.currentQuestionIndex === this.questions.length - 1;
        }
        
        if (submitBtn) {
            // Always show submit button so student can submit at any time
            submitBtn.style.display = 'inline-block';
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

    // Remove the old submitExam method since it's now handled by the modal
    // The endExam method is still used but called from the modal confirm button

    endExam() {
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Calculate score
        const score = this.calculateScore();
        
        // Show results screen
        this.showResults(score);
        
        // Save exam result to database
        this.saveExamResult(score);
    }
    
    saveExamResult(score) {
        if (examDB && examDB.db) {
            examDB.saveExamResult({
                subject: this.selectedSubject,
                year: this.selectedYear,
                score: score,
                totalQuestions: this.questions.length,
                date: new Date().toISOString()
            });
        }
    }

    calculateScore() {
        let score = 0;
        for (const questionId in this.answers) {
            const question = this.questions.find(q => q.id == questionId);
            if (question && this.answers[questionId] === question.correctAnswer) {
                score++;
            }
        }
        return score;
    }

    showResults(score) {
        document.getElementById('score-display').textContent = score;
        document.getElementById('total-questions').textContent = this.questions.length;
        
        const percentage = Math.round((score / this.questions.length) * 100);
        document.getElementById('percentage').textContent = percentage;
        
        // Change color based on performance
        const percentageElement = document.getElementById('percentage');
        if (percentage >= 70) {
            percentageElement.style.color = '#27ae60';
        } else if (percentage >= 50) {
            percentageElement.style.color = '#f39c12';
        } else {
            percentageElement.style.color = '#e74c3c';
        }
        
        this.showScreen('results-screen');
    }

    restartExam() {
        this.showScreen('subject-selection-screen');
    }

    // Review methods
    finishReview() {
        this.showScreen('results-screen');
    }

    // Helper function to show diagram in a modal
    showDiagram(diagramData) {
        // Create or update diagram modal
        let modal = document.getElementById('diagram-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'diagram-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Question Diagram</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="diagram-content"></div>
                        </div>
                        <div class="modal-footer">
                            <button id="close-diagram">Close</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add event listener to close button
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.querySelector('#close-diagram').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Decode and display the diagram
        try {
            const decodedDiagram = decodeURIComponent(diagramData);
            document.getElementById('diagram-content').innerHTML = decodedDiagram;
            modal.style.display = 'block';
        } catch (e) {
            console.error('Error decoding diagram:', e);
            document.getElementById('diagram-content').innerHTML = '<p>Error loading diagram</p>';
            modal.style.display = 'block';
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CBTExamApp();
});