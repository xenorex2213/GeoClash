
let playerId = "";
let gameId = "";
let pollingInterval;

const BASE_URL = "/api/game"
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

        const res = await fetch(`${BASE_URL}/${gameId}?playerId=${playerId}`);
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

            // Show location info for setter
            if (data.location && data.players[playerId].role === "setter") {
                const loc = data.location;
                document.getElementById("locationInfo").style.display = "block";
                document.getElementById("locationInfo").innerHTML =
                    `<strong>Location Set:</strong> ${loc.city}, ${loc.state || ''}, ${loc.country || ''}<br>` +
                    `<strong>Continent:</strong> ${loc.continent || 'N/A'}<br>` +
                    `<strong>Coordinates:</strong> ${loc.lat}, ${loc.lng}`;
            }

            // Show wrong attempts count
            if (data.wrongAttempts !== undefined && data.wrongAttempts > 0) {
                document.getElementById("attemptsDisplay").style.display = "block";
                document.getElementById("attemptsDisplay").innerText =
                    "Wrong Attempts: " + data.wrongAttempts;
            }
        }

        if (data.guesses) {
                let guessText = "";

                data.guesses.forEach(g => {
                    guessText += g.playerId + " guessed: " + g.guess + "\n";
                });

            if (data.revealedHints && data.revealedHints.length > 0) {
                if(data.revealedHints.length >= 3){
                    guessText += "\nAll Hints\n"
                }
                else{
                    guessText += "\nHints\n"
                }
                data.revealedHints.forEach(h => {
                    guessText += h + "\n";
                });
            }
            document.getElementById("guessMessage").innerText = guessText;
        

    }


        // Update score display for guesser during polling
        if(data.players && data.players[playerId]) {
            const player = data.players[playerId];
            if (player.role === "guesser") {
                document.getElementById("scoreDisplay").innerText =
                    "Score: " + player.score;
            }
        }

        // If game completed
        if (data.status === "completed") {
            clearInterval(pollingInterval);
            pollingInterval = null;

            showPage("gamePage");

            document.getElementById("roleDisplay").innerText =
                "ROUND COMPLETED";

            const finalScore = data.players[playerId].score;
            const role = data.players[playerId].role;

            let resultText = "Game Over!\n";
            if (role === "guesser") {
                resultText += "Your Final Score: " + finalScore + "\n";
            }
            if (data.location) {
                resultText += "The location was: " + data.location.city;
                if (data.location.country) resultText += ", " + data.location.country;
            }
            if (data.guesses && data.guesses.length > 0) {
                resultText += "\n\nGuess History:\n";
                data.guesses.forEach(g => {
                    resultText += "  " + g.playerId + " guessed: " + g.guess + "\n";
                });
            }

            document.getElementById("guessMessage").innerText = resultText;

            document.getElementById("setterSection").style.display = "none";
            document.getElementById("guesserSection").style.display = "none";
            document.getElementById("locationInfo").style.display = "none";
        }

    }, 1000);
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
    if (!location) {
        alert("Please enter a location");
        return;
    }

    const res = await fetch(`${BASE_URL}/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, location })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Error setting location");
        return;
    }

    // Show geocoded location details to setter
    if (data.location) {
        const loc = data.location;
        document.getElementById("locationInfo").style.display = "block";
        document.getElementById("locationInfo").innerHTML =
            `<strong>Location Set:</strong> ${loc.city}, ${loc.state || ''}, ${loc.country || ''}<br>` +
            `<strong>Continent:</strong> ${loc.continent || 'N/A'}<br>` +
            `<strong>Coordinates:</strong> ${loc.lat}, ${loc.lng}`;
    }

    document.getElementById("locationInput").disabled = true;
    document.getElementById("locationInput").value = "";
    document.getElementById("setLocationBtn").disabled = true;
    document.getElementById("setLocationBtn").innerText = "Location Set — Waiting for guess...";
}

async function submitGuess() {
    const guess = document.getElementById("guessInput").value;
    if (!guess) {
        alert("Please enter a guess");
        return;
    }

    const res = await fetch(`${BASE_URL}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, playerId, guess })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Error submitting guess");
        return;
    }

    document.getElementById("guessInput").value = "";

    if (data.status === "completed") {
        document.getElementById("guessMessage").innerText =
            "Correct! Final Score: " + data.score;
        document.getElementById("guessInput").disabled = true;
        document.getElementById("submitGuessBtn").disabled = true;
    } else {
        document.getElementById("guessMessage").innerText = data.message;
        if (data.score !== undefined) {
            document.getElementById("scoreDisplay").innerText =
                "Score: " + data.score;
        }
    }
}