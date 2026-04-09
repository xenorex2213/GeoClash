import { useState } from "react";

function MainMenu({ playerId, setGameId }) {
  const [joinId, setJoinId] = useState("");
  const [totalRounds, setTotalRounds] = useState(3);
  const [mode,setMode] = useState("text");
  const selectedOption = "border-[#7AE6FF] bg-[#7AE6FF]/20 text-[#7AE6FF] shadow-[0_0_0_1px_rgba(122,230,255,0.35)]";
  const unselectedOption = "border-outline-variant/30 text-on-surface-variant hover:border-[#7AE6FF]/55 hover:text-[#BDEFFF]";

  // 🎮 Create game
  const handleCreate = async () => {
    const res = await fetch("/api/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalRounds,mode }) // ✅ FIX
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
    <div className="bg-surface text-on-surface min-h-screen relative overflow-hidden">
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="font-headline text-2xl font-bold tracking-tighter text-[#a4ffb9] drop-shadow-[0_0_8px_rgba(164,255,185,0.4)]">Kinetic Explorer</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Connected as</span>
              <span className="text-sm font-bold text-primary font-headline">{playerId}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-24 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <section className="container mx-auto px-6 max-w-5xl py-12">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter mb-4 gradient-text">GEOGUESS</h1>
            <p className="text-on-surface-variant font-body tracking-widest uppercase text-sm">Precision Navigation &amp; Global Reconnaissance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass-card rounded-xl p-8 flex flex-col group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">add_circle</span>
                </div>
                <h2 className="text-2xl font-headline font-bold">Create Game</h2>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Session Parameters</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${totalRounds === 3 ? selectedOption : unselectedOption}`} onClick={() => setTotalRounds(3)} type="button">
                      3 Rounds
                    </button>
                    <button className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${totalRounds === 5 ? selectedOption : unselectedOption}`} onClick={() => setTotalRounds(5)} type="button">
                      5 Rounds
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Game Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${mode === "map" ? selectedOption : unselectedOption}`} onClick={() => setMode("map")} type="button">
                      <span className="material-symbols-outlined mb-2">map</span>
                      <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Geospatial Map</span>
                    </button>
                    <button className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${mode === "text" ? selectedOption : unselectedOption}`} onClick={() => setMode("text")} type="button">
                      <span className="material-symbols-outlined mb-2">terminal</span>
                      <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Text-Based Input</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant leading-relaxed">Create a new lobby and invite your friend. Mode and rounds are synced for both players.</p>
                </div>
              </div>

              <button className="kinetic-button mt-8 w-full py-4 rounded-lg font-headline font-bold text-on-primary flex items-center justify-center gap-2" onClick={handleCreate}>
                START SESSION <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="glass-card rounded-xl p-8 flex flex-col group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-2xl">hub</span>
                </div>
                <h2 className="text-2xl font-headline font-bold">Join Game</h2>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Access Terminal</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-highest border-none rounded-lg py-4 px-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary transition-all" placeholder="Enter Game ID..." type="text" value={joinId} onChange={(e) => setJoinId(e.target.value)} autoComplete="off" />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">keyboard</span>
                  </div>
                </div>
              </div>

              <button className="mt-8 w-full py-4 rounded-lg bg-surface-bright font-headline font-bold text-on-surface border border-outline-variant/30 hover:border-tertiary hover:bg-tertiary/5 transition-all flex items-center justify-center gap-2" onClick={handleJoin}>
                JOIN MISSION <span className="material-symbols-outlined">login</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainMenu;