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
    <div>
      <h2>Welcome {playerId}</h2>

      {/* 🔥 ROUND SELECTOR */}
      <div>
        <h3>Select Number of Rounds</h3>

        <button
          onClick={() => setTotalRounds(3)}
          style={{
            backgroundColor: totalRounds === 3 ? "#4caf50" : "gray",
            color: "white",
            marginRight: "10px"
          }}
        >
          3 Rounds
        </button>

        <button
          onClick={() => setTotalRounds(5)}
          style={{
            backgroundColor: totalRounds === 5 ? "#4caf50" : "gray",
            color: "white"
          }}
        >
          5 Rounds
        </button>

        <p>Selected: {totalRounds} rounds</p>
      </div>

      <br />

      <button onClick={handleCreate}>Create Game</button>

      <br /><br />

      <input
        placeholder="Enter Game ID"
        value={joinId}
        onChange={(e) => setJoinId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Game</button>
    </div>
  );
}

export default MainMenu;