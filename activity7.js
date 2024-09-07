let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;

async function fetchQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.innerText = option;
        li.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(li);
    });

    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').disabled = true;
}

function selectAnswer(selectedIndex) {
    clearTimeout(timer);

    const question = questions[currentQuestionIndex];
    const correctIndex = question.correct;

    const options = document.querySelectorAll('#options li');
    options.forEach((option, index) => {
        option.classList.remove('selected');
        if (index === selectedIndex) {
            option.classList.add('selected');
        }
    });

    if (selectedIndex === correctIndex) {
        score++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        document.getElementById('feedback').innerText = 'Incorrect!';
    }

    document.getElementById('next-btn').disabled = false;
}

function startTimer() {
    let timeLeft = 15;
    document.getElementById('time').innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            moveToNextQuestion();
        }
    }, 1000);
}

function moveToNextQuestion() {
    clearTimeout(timer);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        startTimer();
    } else {
        displayScore();
    }
}

function displayScore() {
    document.getElementById('quiz-container').style.display = 'none';
    const scoreMessage = score === questions.length 
        ? 'Congratulations!' 
        : '\nBetter luck next time!';
    document.getElementById('score-message').innerText = `You scored ${score}/${questions.length}. ${scoreMessage}`;
    document.getElementById('score-container').style.display = 'block';
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'none';
    fetchQuestions();
}

document.getElementById('next-btn').addEventListener('click', moveToNextQuestion);

fetchQuestions();
