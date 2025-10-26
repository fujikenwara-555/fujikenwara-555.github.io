const newQuoteButton = document.querySelector('#js-new-quote');

const quoteText = document.querySelector('#js-quote-text');
const answerText = document.querySelector('#js-answer-text');

const endpoint = 'https://trivia.cyberwisp.com/getrandomquestion';

newQuoteButton.addEventListener('click', getQuote);

async function getQuote() {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }

    const json = await response.json();
    console.log(json.question);
    displayQuote(json.question);
    displayAnswer(json.answer);
  } catch (err) {
    console.error(err);
    alert('Error fetching trivia. Try again.');
  }
}

function displayQuote(quote) {
  quoteText.textContent = quote;
}

function displayAnswer(answer) {
  answerText.textContent = answer;
}

getQuote();
