import { useState, useEffect } from "react";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import Setter from "./components/Setter";
import Guesser from "./components/Guesser";
import Waiting from "./components/Waiting";
import Game from "./components/Game";

function App() {
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState("");
  const [game, setGame] = useState(null);

  const [showRoundResult, setShowRoundResult] = useState(false);

  // ---------------- POLLING ----------------
  useEffect(() => {
    if (!gameId || !playerId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/game/${gameId}?playerId=${playerId}`);
        const data = await res.json();

        const newGame = data.game;

        // auto assign role
        if (newGame.status === "role") {
          await fetch("/api/game/role", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId }),
          });
        }

        // detect round change
        if (game && newGame.currentRound !== game.currentRound) {
          setShowRoundResult(true);

          setTimeout(() => {
            setShowRoundResult(false);
          }, 2000);
        }

        setGame({ ...newGame });

      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameId, playerId, game]);

  // ---------------- LOGIN ----------------
  if (!playerId) {
    return <Login setPlayerId={setPlayerId} />;
  }

  // ---------------- MENU ----------------
  if (!gameId) {
    return <MainMenu playerId={playerId} setGameId={setGameId} />;
  }

  // ---------------- LOADING ----------------
  if (!game) {
    return (
      <div className="app">
        <div className="shell">
          <div className="card">
            <div className="cardHeader">
              <h2 className="h2">Loading…</h2>
              <span className="badge badgeAccent">Sync</span>
            </div>
            <div className="cardInner">
              <div className="toast">Fetching game state for {gameId}.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const player = game.players?.[playerId];

  // ---------------- FINAL SCREEN ----------------
  if (game.status === "completed") {
    let winner = null;
    let max = -1;

    Object.entries(game.players).forEach(([id, p]) => {
      if (p.totalScore > max) {
        max = p.totalScore;
        winner = id;
      }
    });

    return (
      <div className="app">
        <div className="shell">
          <div className="topbar">
            <div className="brand">
              <div className="logo" aria-hidden="true" />
              <div className="brandTitle">
                <strong>GeoGuess</strong>
                <span>Results</span>
              </div>
            </div>
            <span className="chip">
              <span className="muted">Game</span>
              <strong style={{ letterSpacing: ".18em" }}>{gameId}</strong>
            </span>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h1 className="h1">Game Over</h1>
              <span className="badge badgeSuccess">Completed</span>
            </div>
            <div className="cardInner stack">
              <div className="toast toastAccent">
                Winner: <strong>{winner}</strong>
              </div>

              <div className="panel">
                <div className="panelHeader">
                  <h4>Final Scores</h4>
                </div>
                <div className="scroll">
                  <ul className="list">
                    {Object.entries(game.players).map(([id, p]) => (
                      <li className="listItem" key={id}>
                        <div className="rowWrap">
                          <strong>{id}</strong>
                          <span className="muted">•</span>
                          <span className="muted">Total</span>
                          <strong>{p.totalScore}</strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="small center">Refresh the page to start over.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ROUND RESULT ----------------
  if (showRoundResult) {
    return (
      <div className="app">
        <div className="shell">
          <div className="card">
            <div className="cardHeader">
              <h2 className="h2">Round Complete</h2>
              <span className="badge badgeSuccess">Next</span>
            </div>
            <div className="cardInner stack">
              <div className="toast toastAccent">
                Moving to Round <strong>{game.currentRound}</strong> / {game.totalRounds}
              </div>
              <div className="small center">Roles will be re-assigned automatically.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- WAITING / ROLE ----------------
  if (game.status === "lobby" || game.status === "role") {
    return <Waiting gameId={gameId} playerId={playerId} game={game} />;
  }

  // ---------------- MAIN GAME ----------------
  return (
    <Game gameId={gameId} playerId={playerId} game={game}>
      {player?.role === "setter" && (
        <Setter
          gameId={gameId}
          playerId={playerId}
          player={player}
          game={game}
        />
      )}

      {player?.role === "guesser" && (
        <Guesser
          gameId={gameId}
          playerId={playerId}
          player={player}
          game={game}
        />
      )}
    </Game>
  );
}

export default App;