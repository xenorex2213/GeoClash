import { useState } from "react";

function Guesser({ gameId, playerId, player, game }) {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  const handleGuess = async () => {
    if (!guess) return;

    try {
      const res = await fetch("/api/game/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId, guess }),
      });

      const data = await res.json();

      // 🔥 Show feedback instantly
      if (data.message) {
        setMessage(data.message);
      } else if (data.status === "completed") {
        setMessage("Correct Guess! 🎉");
      }

      setGuess("");
    } catch (err) {
      console.error("Guess error:", err);
    }
  };

  return (
    <div>
      <h3>Make a Guess</h3>

      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleGuess}>Guess</button>

      {/* 🔥 MESSAGE */}
      {message && <p>{message}</p>}

      {/* 🔥 SCORE */}
      <p>Score: {player.score}</p>

      {/* 🔥 HINTS */}
      <h4>Hints:</h4>
      {game.revealedHints?.length === 0 ? (
        <p>No hints yet</p>
      ) : (
        <ul>
          {game.revealedHints?.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {/* 🔥 GUESSES */}
      <h4>Previous Guesses:</h4>
      {game.guesses?.length === 0 ? (
        <p>No guesses yet</p>
      ) : (
        <ul>
          {game.guesses?.map((g, i) => (
            <li key={i}>
              {g.playerId}: {g.guess}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Guesser;