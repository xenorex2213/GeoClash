import { useState, useEffect } from "react";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import Setter from "./components/Setter";
import Guesser from "./components/Guesser";

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
    return <div>Loading Game...</div>;
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
      <div>
        <h1>🏆 Game Over</h1>

        <h3>Final Scores:</h3>
        {Object.entries(game.players).map(([id, p]) => (
          <p key={id}>
            {id}: {p.totalScore}
          </p>
        ))}

        <h2>Winner: {winner}</h2>
      </div>
    );
  }

  // ---------------- ROUND RESULT ----------------
  if (showRoundResult) {
    return (
      <div>
        <h2>🎉 Round Complete!</h2>
        <p>Moving to Round {game.currentRound}</p>
      </div>
    );
  }

  // ---------------- MAIN GAME ----------------
  return (
    <div>
      <h2>Game Started</h2>

      <p>Game ID: {gameId}</p>
      <p>Status: {game.status}</p>

      {/* 🟢 ROUND INFO */}
      <h3>
        Round {game.currentRound} / {game.totalRounds}
      </h3>

      {/* 🟢 PLAYER INFO */}
      {player && (
        <>
          <p>Your Role: {player.role}</p>
          <p>Round Score: {player.roundScore}</p>
          <p>Total Score: {player.totalScore}</p>
        </>
      )}

      {/* 🟢 GAME SCREENS */}
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
    </div>
  );
}

export default App;