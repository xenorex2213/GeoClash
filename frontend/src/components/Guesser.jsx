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
    <div className="stack">
      <div className="toast">
        <div className="rowWrap">
          <strong>Guesser:</strong>
          <span className="muted">Find the city.</span>
          <span className="muted">•</span>
          <span className="muted">Round score</span>
          <strong>{player?.roundScore ?? "—"}</strong>
        </div>
      </div>

      {message && (
        <div className={`toast ${message.toLowerCase().includes("incorrect") ? "toastDanger" : "toastAccent"}`}>
          {message}
        </div>
      )}

      <div className="panel">
        <div className="panelHeader">
          <h4>Submit Guess</h4>
          <span className="badge badgeAccent">Action</span>
        </div>
        <div className="scroll">
          <label className="label" htmlFor="guessInput">
            City
          </label>
          <div className="stack">
            <input
              id="guessInput"
              className="input"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="e.g. Paris"
              autoComplete="off"
            />
            <button className="btn btnPrimary" onClick={handleGuess}>
              Guess
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panelHeader">
          <h4>Hints</h4>
          <span className="small">Revealed on wrong attempts</span>
        </div>
        <div className="scroll">
          {game?.revealedHints?.length ? (
            <ul className="list">
              {game.revealedHints.map((h, i) => (
                <li className="listItem" key={i}>
                  {h}
                </li>
              ))}
            </ul>
          ) : (
            <div className="small">No hints yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Guesser;