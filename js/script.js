const guessedLetters = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesNumber = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia";
let guessedLettersArray = [];
let remainingGuesses = 8;

//Random Word API 
const getWord = async function () {
    const res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const data = await res.text();
    const wordArray = data.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
};

getWord();
//Display symbols as letter placeholders
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        console.log(letter);
        placeholderLetters.push("●");
    }
    wordProgress.innerText = placeholderLetters.join("");
};

//Allow players to guess letters
guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    message.innerText = "";
    const guessInput = letterInput.value;
    const validGuess = validateInput(guessInput);
    if (validGuess) {
        makeGuess(guessInput);
    }
   letterInput.value = "";
});

//Validation check of player's guessed letters
const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please enter a letter.";
    } else if (input.length != 1) {
        message.innerText = "Please enter one letter per turn.";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please enter a valid character.";
    } else {
        return input;
    }
};

//Validation check cont. Push changes
const makeGuess = function (guessInput) {
    guessInput = guessInput.toUpperCase();
    if (guessedLettersArray.includes(guessInput)) {
        message.innerText = "You already guessed that letter. Try again.";
    } else {
        guessedLettersArray.push(guessInput);
        console.log(guessedLettersArray);
        displayGuessedLetters();
        remainingGuessesUpdate(guessInput);
        displayWordProgress(guessedLettersArray);
    }
};

//Display list of ALL valid, guessed letters 
const displayGuessedLetters = function () {
    guessedLetters.innerHTML = "";
    for (const letter of guessedLettersArray) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLetters.append(li);
    }
};

//Reveal CORRECTLY guessed, valid letters
const displayWordProgress = function (guessedLettersArray) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    //note: while Vanna White is not a good variable name, but it is a funny one
    const vannaWhite = [];
    for (const letter of wordArray) {
        if (guessedLettersArray.includes(letter)) {
            vannaWhite.push(letter.toUpperCase());
        } else {
            vannaWhite.push("●");
        }
    }
    wordProgress.innerText = vannaWhite.join("");
    winCheck();
};

//Player progress messages
const remainingGuessesUpdate = function (guessInput) {
    const upperWord = word.toUpperCase();
    if (upperWord.includes(guessInput)) {
        message.innerText = `Perfect! You guessed a correct letter`; 
    } else {
        message.innerText = `Sorry, the word does not contain that letter`;
        remainingGuesses -= 1;
    }
    
    if (remainingGuesses === 0) {
        message.innerHTML = `Game over. The word was: <span>${word.toUpperCase()}</span>.`;
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesNumber.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesNumber.innerText = `${remainingGuesses} guesses`;
    }

};

//Check if game is won
const winCheck = function () {
    if (word.toUpperCase() === wordProgress.innerText) {
      message.classList.add("win");
      message.innerHTML = `<p class="highlight">You guessed correct the word! Congrats!</p>`;
    
      startOver();
    }
};

//End of game, start over option
const startOver = function () {
    guessButton.classList.add("hide");
    remainingGuessesNumber.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

//Reset values and grab a new word form the API
playAgainButton.addEventListener("click", function () {
    message.classList.remove("win");
    guessedLettersArray = [];
    remainingGuesses = 8;
    remainingGuessesNumber.innerText = `${remainingGuesses} guesses`;
    guessedLetters.innerHTML = "";
    message.innerText = "";
    getWord();

    guessButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesNumber.classList.remove("hide");
    remainingGuessesElement.classList.remove("hide");
});
