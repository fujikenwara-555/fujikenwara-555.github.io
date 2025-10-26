// Select elements
const newQuoteButton = document.getElementById('js-new-quote');
const answerButton = document.getElementById('js-show-answer');
const quoteTextElement = document.getElementById('js-quote-text');
const answerTextElement = document.getElementById('js-answer-text');

// API endpoint
const apiEndpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

// Add event listeners
newQuoteButton.addEventListener('click', getQuote);
answerButton.addEventListener('click', showAnswer);

// Get quote function
async function getQuote() {
    console.log('Button clicked - fetching quote...');
    
    try {
        // Disable button and show loading
        newQuoteButton.disabled = true;
        newQuoteButton.textContent = 'Loading...';
        answerTextElement.textContent = '';
        quoteTextElement.textContent = 'Loading...';
        
        // Fetch from API
        const response = await fetch(apiEndpoint);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        
        // Display the question
        displayQuote(data);
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteTextElement.textContent = 'Sorry, failed to load trivia. Please try again.';
        alert('Error: ' + error.message);
    } finally {
        // Re-enable button
        newQuoteButton.disabled = false;
        newQuoteButton.textContent = 'Generate a new bit of trivia!';
    }
}

// Display quote function
function displayQuote(data) {
    if (data && data.question) {
        quoteTextElement.textContent = data.question;
        // Store answer in data attribute for later use
        quoteTextElement.dataset.answer = data.answer;
    } else {
        quoteTextElement.textContent = 'No question available. Please try again.';
    }
}

// Show answer function
function showAnswer() {
    const answer = quoteTextElement.dataset.answer;
    if (answer) {
        answerTextElement.textContent = `Answer: ${answer}`;
    } else {
        answerTextElement.textContent = 'No question loaded yet!';
    }
}

// Load initial quote when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing app');
    getQuote(); // Load a quote immediately
});