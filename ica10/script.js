
const newQuoteButton = document.querySelector('#js-new-quote');
const answerButton = document.querySelector('#js-tweet');
const quoteTextElement = document.querySelector('#js-quote-text');
const answerTextElement = document.querySelector('#js-answer-text');

const apiEndpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

// Event listener for new quote button
newQuoteButton.addEventListener('click', getQuote);

// Event listener for answer button
answerButton.addEventListener('click', showAnswer);

// Function to get a new quote
async function getQuote() {
    try {
        // Disable button during fetch to prevent multiple clicks
        newQuoteButton.disabled = true;
        newQuoteButton.textContent = 'Loading...';
        
        // Clear previous answer
        answerTextElement.textContent = '';
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Output to console for debugging
        console.log('Quote received:', data);
        
        // Display the quote
        displayQuote(data);
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        alert('Failed to fetch trivia question. Please try again.');
        
        // Display error in quote area
        quoteTextElement.textContent = 'Failed to load trivia question. Please try again.';
    } finally {
        // Re-enable button
        newQuoteButton.disabled = false;
        newQuoteButton.textContent = 'Generate a new bit of trivia!';
    }
}

// Function to display the quote
function displayQuote(data) {
    quoteTextElement.textContent = data.question;
    
    // Store the answer for later use
    quoteTextElement.dataset.answer = data.answer;
}

// Function to show the answer
function showAnswer() {
    const answer = quoteTextElement.dataset.answer;
    if (answer) {
        answerTextElement.textContent = `Answer: ${answer}`;
    } else {
        answerTextElement.textContent = 'No trivia question loaded. Please generate one first!';
    }
}

// Load a quote when the page first loads
document.addEventListener('DOMContentLoaded', getQuote);