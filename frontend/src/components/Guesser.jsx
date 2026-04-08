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
    <div className="bg-surface font-body text-on-surface min-h-screen overflow-hidden">
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 h-16 shadow-[0_0_40px_rgba(164,255,185,0.06)]">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold tracking-tighter text-emerald-400 font-headline">The Kinetic Explorer</span>
        </div>
        <div className="text-xs uppercase tracking-widest text-on-surface-variant">Guesser • {game?.mode || "-"} mode</div>
      </nav>

      <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 flex-col pt-20 pb-8 px-4 hidden md:flex">
        <div className="mb-10 px-4">
          <h2 className="font-headline text-xl uppercase tracking-widest text-emerald-400">GeoGuess</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">{playerId}</p>
        </div>
      </aside>

      {game?.mode === "map" ? (
        <main className="pl-0 md:pl-64 pt-16 h-screen w-full relative">
          <div className="absolute inset-0 z-0">
            <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickHandler onClick={setCoords} />
            </MapContainer>
          </div>

          <div className="relative z-10 h-full w-full p-8 flex flex-col gap-8 pointer-events-none">
            <div className="glass-panel p-6 rounded-xl max-w-lg pointer-events-auto">
              <span className="font-label uppercase tracking-widest text-[10px] text-primary">Map Triangulation</span>
              <h2 className="font-headline text-2xl font-bold mt-2">Select Coordinates</h2>
              <div className="text-xs text-on-surface-variant mt-2">
                {coords ? `Selected: ${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}` : "Click anywhere on the map."}
              </div>
              <button className="mt-4 w-full py-3 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest rounded shadow-[0_0_20px_rgba(164,255,185,0.2)] pointer-events-auto" onClick={handleMapGuess}>
                Submit Location
              </button>
            </div>

            <div className="glass-panel p-6 rounded-xl mt-auto max-w-lg pointer-events-auto">
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest mb-3">Revealed Hints</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant max-h-48 overflow-y-auto">
                {game?.revealedHints?.length ? game.revealedHints.map((h, i) => <li key={i} className="p-2 bg-surface-container-high rounded">{h}</li>) : <li>No hints yet.</li>}
              </ul>
            </div>
          </div>
        </main>
      ) : (
        <main className="md:pl-64 pt-16 h-screen w-full bg-surface">
          <div className="h-full w-full p-6 lg:p-10 flex flex-col gap-8 relative overflow-y-auto">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
              <div>
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-1">Active Operation</p>
                <h1 className="font-headline text-4xl lg:text-5xl font-bold tracking-tighter text-on-surface">TEXT-BASED <span className="text-primary">GUESSER</span></h1>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 flex-1 min-h-0">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="glass-panel rounded-xl p-8 flex-1 flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">radar</span>
                    <h3 className="font-headline text-lg font-bold tracking-wide uppercase">Environmental Data Feed</h3>
                  </div>
                  <div className="space-y-3 text-sm text-on-surface-variant">
                    {game?.revealedHints?.length ? game.revealedHints.map((h, i) => <div key={i} className="p-3 bg-surface-container-highest rounded-lg">{h}</div>) : <div className="p-3 bg-surface-container-highest rounded-lg">No hints revealed yet.</div>}
                  </div>
                </div>

                <div className="glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-4 items-stretch">
                  <div className="flex-1 relative group">
                    <input className="w-full h-14 bg-surface-container-highest border border-outline-variant/30 rounded-lg px-6 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-on-surface placeholder:text-on-surface-variant/40" placeholder="Enter city or landmark..." type="text" value={guess} onChange={(e) => setGuess(e.target.value)} />
                  </div>
                  <button className="bg-primary-container text-on-primary-container px-10 h-14 rounded-lg font-headline font-bold text-sm tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.95] transition-all shadow-lg shadow-primary/10" onClick={handleTextGuess}>
                    Submit Guess
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="glass-panel rounded-xl p-6 flex flex-col gap-4">
                  <h3 className="font-headline text-sm font-bold tracking-widest uppercase">Mission Data</h3>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Round</span><span>{game?.currentRound}/{game?.totalRounds}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Wrong Attempts</span><span>{game?.wrongAttempts ?? 0}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Guesses</span><span>{game?.guesses?.length || 0}</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Guesser;