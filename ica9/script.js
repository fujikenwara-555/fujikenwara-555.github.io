const newQuoteButton = document.querySelector('#js-new-quote');
const answerButton = document.querySelector('#js-tweet');
const quoteTextElement = document.querySelector('#js-quote-text');
const answerTextElement = document.querySelector('#js-answer-text');

const apiEndpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

newQuoteButton.addEventListener('click', getQuote);

answerButton.addEventListener('click', showAnswer);

async function getQuote() {
    try {
        newQuoteButton.disabled = true;
        newQuoteButton.textContent = 'Loading...';
        
        answerTextElement.textContent = '';
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        console.log('Quote received:', data);
        
        displayQuote(data);
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        alert('Failed to fetch trivia question. Please try again.');

        quoteTextElement.textContent = 'Failed to load trivia question. Please try again.';
    } finally {
        newQuoteButton.disabled = false;
        newQuoteButton.textContent = 'Generate a new bit of trivia!';
    }
}

function displayQuote(data) {
    quoteTextElement.textContent = data.question;
    
    quoteTextElement.dataset.answer = data.answer;
}

function showAnswer() {
    const answer = quoteTextElement.dataset.answer;
    if (answer) {
        answerTextElement.textContent = `Answer: ${answer}`;
    } else {
        answerTextElement.textContent = 'No trivia question loaded. Please generate one first!';
    }
}

document.addEventListener('DOMContentLoaded', getQuote);