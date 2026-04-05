import { useState } from "react";

function Setter({ gameId, playerId ,game}) {
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

  return (
    <div>
      <h3>Set Location</h3>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleSet}>Set</button>
       <h3>Guesses</h3>
      <ul>
        {game?.guesses?.map((g, i) => (
          <li key={i}>
            {g.playerId}: {g.guess}
          </li>
        ))}
      </ul>
      <h3>Hints Revealed</h3>
      <ul>
        {game?.revealedHints?.map((hint, i) => (
          <li key={i}>{hint}</li>
        ))}
      </ul>
    </div>
  );
}

export default Setter;