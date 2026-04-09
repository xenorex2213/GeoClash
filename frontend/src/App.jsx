import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import MainMenu from "./components/MainMenu";
import Setter from "./components/Setter";
import Guesser from "./components/Guesser";
import Waiting from "./components/Waiting";

function App() {
  const [showHome, setShowHome] = useState(true);
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
    if (showHome) {
      return <Home onPlay={() => setShowHome(false)} />;
    }

    return <Login setPlayerId={setPlayerId} />;
  }

  // ---------------- MENU ----------------
  if (!gameId) {
    return <MainMenu playerId={playerId} setGameId={setGameId} />;
  }

  // ---------------- LOADING ----------------
  if (!game) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-6">
        <div className="glass-card rounded-xl p-10 w-full max-w-xl border border-primary/20 text-center">
          <div className="material-symbols-outlined text-primary text-5xl animate-pulse mb-4">sync</div>
          <h2 className="text-3xl font-headline font-bold">Syncing Mission</h2>
          <p className="text-on-surface-variant mt-3">Fetching game state for {gameId}...</p>
          <div className="mt-6 h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div className="h-full w-1/2 bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const player = game.players?.[playerId];

  // ---------------- ROUND RESULT ----------------
  if (showRoundResult) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-6">
        <div className="glass-card rounded-xl p-10 w-full max-w-2xl border border-primary/20 text-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">Round Transition</div>
          <h2 className="text-4xl font-headline font-bold tracking-tight">Round Complete</h2>
          <p className="text-on-surface-variant mt-3">
            Moving to Round <span className="text-primary font-bold">{game.currentRound}</span> / {game.totalRounds}
          </p>
          <div className="mt-6 text-xs uppercase tracking-widest text-on-surface-variant">Roles will be re-assigned automatically</div>
        </div>
      </div>
    );
  }

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
      <div className="bg-surface text-on-surface min-h-screen pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-headline font-bold tracking-tighter text-primary">MISSION COMPLETE</h1>
            <p className="text-on-surface-variant mt-2 uppercase tracking-widest text-xs">Game {gameId}</p>
          </div>

          <div className="glass-card rounded-xl p-8 border border-primary/20">
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary text-lg font-headline font-bold">
              Winner: {winner}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(game.players).map(([id, p]) => (
                <div key={id} className="p-4 rounded-lg bg-surface-container-highest border border-outline-variant/20 flex justify-between items-center">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-on-surface-variant">Explorer</div>
                    <div className="font-headline text-lg font-bold">{id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-on-surface-variant">Total Score</div>
                    <div className="font-headline text-2xl font-bold text-primary">{p.totalScore}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-xs uppercase tracking-widest text-on-surface-variant">Refresh to start a new mission</div>
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
  if (player?.role === "setter") {
    return (
      <Setter
        gameId={gameId}
        playerId={playerId}
        player={player}
        game={game}
      />
    );
  }

  if (player?.role === "guesser") {
    return (
      <Guesser
        gameId={gameId}
        playerId={playerId}
        player={player}
        game={game}
      />
    );
  }

  return <Waiting gameId={gameId} playerId={playerId} game={game} />;
}

export default App;