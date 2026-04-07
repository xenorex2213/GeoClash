import { useState } from "react";

function MainMenu({ playerId, setGameId }) {
  const [joinId, setJoinId] = useState("");
  const [totalRounds, setTotalRounds] = useState(3);

  // 🎮 Create game
  const handleCreate = async () => {
    const res = await fetch("/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalRounds }) // ✅ FIX
    });

    const data = await res.json();
    const newGameId = data.gameId;

    // auto join
    await fetch("/api/game/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId: newGameId, playerId }),
    });

    setGameId(newGameId);
  };

  // 🔗 Join game
  const handleJoin = async () => {
    if (!joinId) return alert("Enter Game ID");

    await fetch("/api/game/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId: joinId, playerId }),
    });

    setGameId(joinId);
  };

  return (
    <div className="app">
      <div className="shell">
        <div className="topbar">
          <div className="brand">
            <div className="logo" aria-hidden="true" />
            <div className="brandTitle">
              <strong>GeoGuess</strong>
              <span>Lobby</span>
            </div>
          </div>

          <span className="chip">
            <span className="muted">Player</span>
            <strong>{playerId}</strong>
          </span>
        </div>

        <div className="grid">
          <div className="card cardInteractive">
            <div className="cardHeader">
              <h2 className="h2">Create a Game</h2>
              <span className="badge badgeSuccess">Host</span>
            </div>

            <div className="cardInner stack">
              <div>
                <div className="label">Rounds</div>
                <div className="segment" role="group" aria-label="Select rounds">
                  <button
                    className={`btn ${totalRounds === 3 ? "btnOn" : ""}`}
                    onClick={() => setTotalRounds(3)}
                    type="button"
                  >
                    3 Rounds
                  </button>
                  <button
                    className={`btn ${totalRounds === 5 ? "btnOn" : ""}`}
                    onClick={() => setTotalRounds(5)}
                    type="button"
                  >
                    5 Rounds
                  </button>
                </div>
                <div className="small">Selected: {totalRounds} rounds</div>
              </div>

              <button className="btn btnPrimary" onClick={handleCreate}>
                Create Game
              </button>
            </div>
          </div>

          <div className="card cardInteractive">
            <div className="cardHeader">
              <h2 className="h2">Join a Game</h2>
              <span className="badge badgeAccent">Invite</span>
            </div>

            <div className="cardInner stack">
              <div>
                <label className="label" htmlFor="joinGameId">
                  Game ID
                </label>
                <input
                  id="joinGameId"
                  className="input"
                  placeholder="4-digit code"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  autoComplete="off"
                />
                <div className="small">Ask the host to share the code.</div>
              </div>

              <button className="btn" onClick={handleJoin}>
                Join Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;