# CBT-TEST

A robust Computer-Based Test (CBT) examination platform with comprehensive functionality and responsive design.

## Features

- **Student Authentication**: Secure login with Student ID and Exam Code
- **Exam Instructions**: Clear instructions before starting the exam
- **Timer Functionality**: Countdown timer with warning when time is running low
- **Question Navigation**: Move between questions with Previous/Next buttons
- **Question List**: Visual overview of all questions with answered status
- **Auto-save**: Answers are saved automatically as you select them
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Results Display**: Shows score and percentage upon completion
- **Exam Restart**: Option to take another exam after completion

## Functionality

- **Login Screen**: Students enter their ID and exam code to start
- **Instructions Screen**: Shows exam guidelines and time limit
- **Exam Screen**: Main testing interface with:
  - Question display
  - Multiple choice options
  - Timer and progress indicator
  - Navigation controls
  - Question list overview
- **Results Screen**: Shows final score and percentage

## Technical Implementation

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Responsive design with animations and transitions
- **JavaScript ES6**: Object-oriented programming with error handling
- **Modern UI**: Clean, intuitive interface with visual feedback

## How to Run

1. Clone the repository
2. Open `index.html` in a web browser, or
3. Use a local server (e.g., `npx serve .`)

## Project Structure

- `index.html` - Main HTML structure
- `styles.css` - Responsive styling with animations
- `script.js` - Core functionality and exam logic
- `package.json` - Project dependencies and scripts

## Robust Features

- Input validation and error handling
- Timer with warning animation
- Prevent accidental page refresh during exam
- Smooth animations and transitions
- Accessible form elements
- Cross-browser compatibility
- Mobile-responsive design
- Question tracking and status indicators

## Sample Questions

The application includes 10 sample questions covering various topics to demonstrate functionality. In a real implementation, questions would be loaded from a database or API.

## Security Considerations

- Client-side validation (server-side validation recommended for production)
- Session management (would need server-side implementation for production)
- Time-based exam completion
- Prevention of back-button navigation during exam

## Customization

The application can be customized by:
- Adding more questions to the questions array
- Adjusting the exam time limit
- Modifying the styling in styles.css
- Extending functionality in script.js