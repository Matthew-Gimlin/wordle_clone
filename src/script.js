// game board dimensions
const GAME_ROWS = 6;
const GAME_COLUMNS = 5;

// contains all valid 5 letter words
const dictionary = ["earth", "plane", "train", "audio"];

// stores the entire game board, as well as the current letter position
const state = {
    secret: dictionary[Math.floor( Math.random() * dictionary.length )],
    grid: [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ],
    currentRow: 0,
    currentColumn: 0
};

// update the grid with the letters guessed
function UpdateGrid()
{
    for (let i = 0; i < GAME_ROWS; ++i)
    {
        for (let j = 0; j < GAME_COLUMNS; ++j)
        {
            const box = document.getElementById(`box ${i} ${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

// draw a single box for a letter
function DrawBox(container, row, column, letter = "")
{
    const box = document.createElement("div");
    box.className = "box";
    box.id = `box ${row} ${column}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

// draw all the boxes of the game board
function DrawGrid(container)
{
    const grid = document.createElement("div");
    grid.className = "grid";

    for (let i = 0; i < GAME_ROWS; ++i)
    {
        for (let j = 0; j < GAME_COLUMNS; ++j)
        {
            DrawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

// update the game board for whatever the user types on the keyboard
function RegisterKeyboardEvents()
{
    document.body.onkeydown = (event) => {
        const key = event.key;

        // the current guess is ready to be checked
        // the guess must have 5 letters
        if (key === "Enter" && state.currentColumn === 5)
        {
            // current guessed word
            const word = state.grid[state.currentRow].reduce((prev, curr) => prev + curr);

            // the guess must be a valid word
            if (dictionary.includes(word))
            {
                RevealWord(word);
                ++state.currentRow;
                state.currentColumn = 0;
            }
            else
            {
                alert("Not a valid word.");
            }
        }

        // removes the last letter typed
        if (key === "Backspace")
        {
            RemoveLetter();
        }

        // adds any valid letters (a-z) to the current letter box
        if (key.length === 1 && key.match(/[a-z]/i))
        {
            AddLetter(key);
        }

        UpdateGrid();
    };
}

// plays the reveal animation, and highlights the letters in the guessed word
function RevealWord(guess)
{
    const row = state.currentRow;
    const ANIMATION_DURATION = 500;

    // update each letter box by comparing the guess to the actual secret word
    for (let i = 0; i < GAME_COLUMNS; ++i)
    {
        const box = document.getElementById(`box ${row} ${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            // the letter is in the correct place
            if (letter === state.secret[i])
            {
                box.classList.add("right");
            }

            // the letter is in the incorrect place
            else if (state.secret.includes(letter))
            {
                box.classList.add("wrong");
            }

            // the secret word does not conatin the letter
            else
            {
                box.classList.add("empty");
            }
        }, ((i + 1) * ANIMATION_DURATION) / 2);

        box.classList.add("animated");
        box.style.animationDelay = `${(i * ANIMATION_DURATION) / 2}ms`;
    }

    setTimeout(() => {
        // the player guessed the secret word
        if (state.secret === guess)
        {
            alert("You won!");
        }

        // the player ran out of guesses
        else if (state.currentRow === 5)
        {
            alert(`You lost. The word was ${state.secret}.`);
        }
    }, 3 * ANIMATION_DURATION);
}

// displays a letter at the current location on the game board
function AddLetter(letter)
{
    if (state.currentColumn === 5) return;

    state.grid[state.currentRow][state.currentColumn] = letter;
    ++state.currentColumn;
}

// removes a letter at the current location on the game board
function RemoveLetter()
{
    if (state.currentColumn === 0) return;

    state.grid[state.currentRow][state.currentColumn - 1] = "";
    --state.currentColumn;
}

// runs on startup
function Main()
{
    const game = document.getElementById("game");
    DrawGrid(game);

    RegisterKeyboardEvents();
}

Main();
