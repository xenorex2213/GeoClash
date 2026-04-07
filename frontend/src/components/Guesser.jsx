import { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";


function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    }
  });
  return null;
}

function Guesser({ gameId, playerId, game }) {
  console.log("FULL GAME : ",game);
  console.log("Mode : ",game.mode);
  const [guess, setGuess] = useState("");
  const [coords, setCoords] = useState(null);

  const handleTextGuess = async () => {
    if (!guess.trim()) return;

    await fetch("/api/game/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ gameId, playerId, guess })
    });

    setGuess("");
  };

  const handleMapGuess = async () => {
    if (!coords) return alert("Click on map");

    await fetch("/api/game/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gameId,
        playerId,
        lat: coords.lat,
        lng: coords.lng
      })
    });
  };

  return (
    <div>
      <h3>Guesser</h3>

      {/* TEXT MODE */}
      {game?.mode === "text" && (
        <>
          {!game?.mode && <p>Loading mode...</p>}
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter city"
          />
          <button onClick={handleTextGuess}>Submit</button>
        </>
      )}

      {/* MAP MODE */}
      {game?.mode === "map" && (
        <>
          {!game?.mode && <p>Loading mode...</p>}
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "400px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler onClick={setCoords} />
          </MapContainer>

          {coords && (
            <p>
              Selected: {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
            </p>
          )}

          <button onClick={handleMapGuess}>Submit Location</button>
        </>
      )}

      {/* Hints */}
      <h3>Hints</h3>
      <ul>
        {game?.revealedHints?.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </div>
  );
}

export default Guesser;