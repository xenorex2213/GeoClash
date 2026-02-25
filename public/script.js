
let playerId = "";
let gameId = "";
let pollingInterval;

const BASE_URL = "http://localhost:3000/api/game"
function showPage(pageId) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("waitingPage").style.display = "none";
    document.getElementById("gamePage").style.display = "none";

    document.getElementById(pageId).style.display = "block";

    // Poll in waiting AND game page
   if (!pollingInterval && (pageId === "waitingPage" || pageId === "gamePage")) {
        startPolling();
    }
}
function startPolling() {
    pollingInterval = setInterval(async () => {
        if (!gameId) return;

        const res = await fetch(`${BASE_URL}/${gameId}`);
        const data = await res.json();

        // If game started
       if (data.status === "playing") {

    // Only switch once
    if (document.getElementById("gamePage").style.display !== "block") {

        showPage("gamePage");

        const role = data.players[playerId].role;

        document.getElementById("roleDisplay").innerText =
            "Your Role: " + role.toUpperCase();

        if (role === "setter") {
            document.getElementById("setterSection").style.display = "block";
        } else {
            document.getElementById("guesserSection").style.display = "block";
        }
    }
}
    if (data.guesses && data.guesses.length > 0) {
    let guessText = "";

    data.guesses.forEach(g => {
        guessText += g.playerId + " guessed: " + g.guess + "\n";
    });

    document.getElementById("guessMessage").innerText = guessText;
}

        // If game completed
        if (data.status === "completed") {
            clearInterval(pollingInterval);

            showPage("gamePage");

            document.getElementById("roleDisplay").innerText =
                "GAME COMPLETED 🎉";

            const finalScore = data.players[playerId].score;

            document.getElementById("guessMessage").innerText =
                "Game Over! Final Score: " + finalScore;

            document.getElementById("setterSection").style.display = "none";
            document.getElementById("guesserSection").style.display = "none";
        }

    }, 2000);
}
function login() {
    playerId = document.getElementById("playerIdInput").value;
    if (!playerId) {
        alert("Enter Player ID");
        return;
    }
    showPage("mainPage");
}

async function createGame() {
    const res = await fetch(`${BASE_URL}/create`, {
        method: "POST"
    });

    const data = await res.json();

    gameId = data.gameId;   

    document.getElementById("displayGameId").innerText = gameId;
    document.getElementById("mainMessage").innerText =
        "Game Created! ID: " + gameId;

    await joinGameAutomatically();  

    showPage("waitingPage");  
}

async function joinGame() {
    gameId = document.getElementById("joinGameIdInput").value;

    const res = await fetch(`${BASE_URL}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId })
    });

    const data = await res.json();
    document.getElementById("mainMessage").innerText = data.message;

    showPage("waitingPage");
}

async function joinGameAutomatically() {
    await fetch(`${BASE_URL}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId })
    });

    showPage("waitingPage");
}

async function assignRole() {
    const res = await fetch(`${BASE_URL}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId })
    });

    const data = await res.json();

    const role = data.players[playerId].role;

    showPage("gamePage");
    document.getElementById("roleDisplay").innerText =
        "Your Role: " + role.toUpperCase();

    if (role === "setter") {
        document.getElementById("setterSection").style.display = "block";
    } else {
        document.getElementById("guesserSection").style.display = "block";
    }
}

async function setLocation() {
    const location = document.getElementById("locationInput").value;

    await fetch(`${BASE_URL}/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, location })
    });

    alert("Location Set. Waiting for guess...");
}

async function submitGuess() {
    const guess = document.getElementById("guessInput").value;

    const res = await fetch(`${BASE_URL}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, guess })
    });

    const data = await res.json();

    if (data.status === "completed") {
        document.getElementById("guessMessage").innerText =
            "Correct! Final Score: " + data.score;
    } else {
        document.getElementById("guessMessage").innerText = data.message;
        document.getElementById("scoreDisplay").innerText =
            "Score: " + data.score;
    }
}