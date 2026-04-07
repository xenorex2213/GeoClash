import { useState } from "react";

function Login({ setPlayerId }) {
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (!input) return alert("Enter Player ID");
    setPlayerId(input.trim().toLowerCase());
  };

  return (
    <div className="app">
      <div className="shell">
        <div className="topbar">
          <div className="brand">
            <div className="logo" aria-hidden="true" />
            <div className="brandTitle">
              <strong>GeoGuess</strong>
              <span>Multiplayer city guessing</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h1 className="h1">Welcome</h1>
            <span className="badge badgeAccent">Player Login</span>
          </div>

          <div className="cardInner stack">
            <div>
              <label className="label" htmlFor="playerId">
                Player ID
              </label>
              <input
                id="playerId"
                className="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. player1"
                autoComplete="off"
              />
              <div className="small">Use a short unique ID (letters/numbers).</div>
            </div>

            <button className="btn btnPrimary" onClick={handleLogin}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;