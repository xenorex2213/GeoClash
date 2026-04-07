import { useState } from "react";

function Setter({ gameId, playerId, game }) {
  const [location, setLocation] = useState("");

  const handleSet = async () => {
    if (!location) return alert("Enter location");

    const res = await fetch("/api/game/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, location }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
    } else {
      alert("Location set!");
      setLocation("");
    }
  };

  const isSet = Boolean(game?.location);

  return (
    <div className="stack">
      <div className={`toast ${isSet ? "toastAccent" : ""}`}>
        {isSet ? (
          <div>
            <strong>Location set.</strong>
            <div className="small" style={{ marginTop: 6 }}>
              Waiting for the guesser. Hints will reveal automatically after wrong guesses.
            </div>
          </div>
        ) : (
          <div>
            <strong>Setter:</strong> Choose a city for this round.
            <div className="small" style={{ marginTop: 6 }}>
              Enter a city name (OpenCage will validate it).
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panelHeader">
          <h4>Set Location</h4>
          <span className={`badge ${isSet ? "badgeSuccess" : "badgeAccent"}`}>
            {isSet ? "Set" : "Pending"}
          </span>
        </div>
        <div className="scroll">
          <label className="label" htmlFor="setterLocation">
            City
          </label>
          <div className="stack">
            <input
              id="setterLocation"
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tokyo"
              disabled={isSet}
              autoComplete="off"
            />
            <button
              className="btn btnPrimary"
              onClick={handleSet}
              disabled={isSet}
            >
              Set Location
            </button>
          </div>

          {game?.location && (
            <>
              <div className="divider" />
              <div className="kv">
                <span>City</span>
                <strong>{game.location.city}</strong>
                <span>State</span>
                <strong>{game.location.state || "—"}</strong>
                <span>Country</span>
                <strong>{game.location.country || "—"}</strong>
                <span>Continent</span>
                <strong>{game.location.continent || "—"}</strong>
                <span>Coordinates</span>
                <strong>
                  {game.location.lat}, {game.location.lng}
                </strong>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Setter;