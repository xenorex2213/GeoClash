import { useState } from "react";

function Setter({ gameId, playerId, game }) {
  const [location, setLocation] = useState("");
  const [latestAiHint, setLatestAiHint] = useState("");

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
      setLatestAiHint(data.aiHint || "");
      setLocation("");
    }
  };

  const isSet = Boolean(game?.location);
  const incorrectGuesses = game?.guesses || [];
  const aiHintToShow = latestAiHint || game?.aiHint || "";

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tighter text-[#a4ffb9] drop-shadow-[0_0_8px_rgba(164,255,185,0.4)] font-headline">Kinetic Explorer</h1>
        </div>
        <div className="hidden md:flex gap-8 items-center mr-8">
          <span className="text-slate-400 font-medium font-headline uppercase tracking-widest text-xs">Explore</span>
          <span className="text-[#a4ffb9] font-bold border-b-2 border-[#a4ffb9] pb-1 font-headline uppercase tracking-widest text-xs">Set Location</span>
          <span className="text-slate-400 font-medium font-headline uppercase tracking-widest text-xs">Community</span>
        </div>
      </header>

      <aside className="fixed left-0 h-full w-64 z-40 bg-[#121414]/80 backdrop-blur-2xl border-r border-white/5 shadow-2xl hidden lg:flex flex-col pt-24 pb-8">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3 p-3 bg-surface-container-highest rounded-xl border-t border-l border-white/10">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <div className="text-on-surface font-headline font-bold text-sm tracking-tight">{playerId}</div>
              <div className="text-slate-500 font-label uppercase tracking-[0.1em] text-[10px]">Role: Setter</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="pl-0 lg:pl-64 pt-20 min-h-screen w-full relative overflow-y-auto">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-surface-container">
            <img
              className="w-full h-full object-cover opacity-55 grayscale brightness-50 contrast-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQWBpIR4UjcXfnwKqMZKOPps4kBetdgcL9lcmQo5HGyGBwbkSmasnP3A7JPhezfyUNHVC0OkD06i9G8nHQV04ErQ24UcPNwsJ-H1Yw0GrmniOwhs4vYXkePd2WCyzpxG9Rrye_5XqvGYgpXVucyyi8BzkWMLdyCOslchGBtVif9xAkiXNlduqWejpuBD7dJNLmQkwvWP2Q2aS9fPkcRKRuA1bkCi1b7eEvNmtTlcLAL2PWxOTsvtj_dpbr8YXfLFUukAE18uMmW-o"
              alt="map backdrop"
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[200%] -translate-y-1/2" />
          </div>
        </div>

        <div className="relative z-10 w-full p-8 pb-24 flex flex-col gap-8">
          <div className="flex justify-between items-start">
            <div className="glass-panel p-6 rounded-xl flex flex-col gap-2">
              <span className="font-label uppercase tracking-widest text-[10px] text-primary">Active Targeting</span>
              <h2 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">
                {isSet ? `${game.location?.city || "TARGET"}, ${game.location?.country || "--"}` : "TARGET UNSET"}
              </h2>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <span className="font-label text-[9px] text-slate-500 uppercase">Game</span>
                  <span className="font-headline text-primary-fixed-dim text-lg">{gameId}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="font-label text-[9px] text-slate-500 uppercase">Round</span>
                  <span className="font-headline text-primary-fixed-dim text-lg">{game?.currentRound}/{game?.totalRounds}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-xl space-y-6">
                <div>
                  <label className="block font-label uppercase tracking-widest text-[10px] text-slate-400 mb-3" htmlFor="setterLocation">City / Location</label>
                  <input
                    id="setterLocation"
                    className="w-full !bg-[#121414] !text-[#EAF0FF] placeholder:!text-[#8b93a8] border border-primary/30 rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/35 outline-none transition-all"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Tokyo"
                    disabled={isSet}
                    autoComplete="off"
                    style={{ WebkitTextFillColor: "#EAF0FF" }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-label text-xs uppercase tracking-wider text-slate-300">Mode</span>
                    <span className="font-headline text-sm font-bold uppercase text-primary">{game?.mode || "text"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-label text-xs uppercase tracking-wider text-slate-300">Wrong Attempts</span>
                    <span className="font-headline text-sm font-bold text-primary">{game?.wrongAttempts ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="font-label text-xs uppercase tracking-wider text-slate-300">Hints Revealed</span>
                    <span className="font-headline text-sm font-bold text-primary">{game?.revealedHints?.length || 0}</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-primary text-on-primary font-headline font-extrabold uppercase tracking-widest text-sm rounded shadow-[0_0_30px_rgba(164,255,185,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50" onClick={handleSet} disabled={isSet}>
                  {isSet ? "COORDINATES LOCKED" : "CONFIRM COORDINATES"}
                </button>

                {isSet && aiHintToShow && (
                  <div className="p-3 rounded-lg border border-[#7AE6FF]/45 bg-[#7AE6FF]/12 text-sm text-[#CFF6FF]">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#7AE6FF] mb-1">AI Popular Hint</div>
                    {aiHintToShow}
                  </div>
                )}

                {isSet && (
                  <div className="text-xs text-on-surface-variant">
                    {game.location?.continent || "--"} • {game.location?.state || "--"} • {game.location?.lat}, {game.location?.lng}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6 h-full">
              <div className="glass-panel p-6 rounded-xl flex flex-col justify-between col-span-2 lg:col-span-1">
                <div>
                  <span className="font-label uppercase tracking-widest text-[10px] text-primary">Round Intel</span>
                  <h3 className="font-headline text-xl font-bold mt-1">Revealed Hints</h3>
                </div>
                <div className="mt-4 max-h-[260px] overflow-auto space-y-2">
                  {game?.revealedHints?.length ? (
                    game.revealedHints.map((hint, i) => (
                      <div key={i} className="p-3 bg-surface-container-highest rounded-lg border border-white/10 text-sm">
                        {hint}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-surface-container-highest rounded-lg border border-white/10 text-sm text-on-surface-variant">
                      No hints revealed yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl flex flex-col gap-6 col-span-2 lg:col-span-1">
                <div>
                  <span className="font-label uppercase tracking-widest text-[10px] text-primary">Guess Activity</span>
                  <h3 className="font-headline text-xl font-bold mt-1">Incorrect Guesses</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-label">Total Incorrect Attempts</span>
                    <span className="text-sm font-headline text-primary font-bold">{game?.wrongAttempts ?? 0}</span>
                  </div>
                  <div className="w-full h-[2px] bg-white/5" />
                  <div className="max-h-[180px] overflow-auto space-y-2">
                    {incorrectGuesses.length ? (
                      incorrectGuesses.map((g, i) => (
                        <div key={i} className="p-3 bg-surface-container-highest rounded-lg border border-white/10 text-sm">
                          <span className="text-on-surface-variant">Attempt {i + 1}</span>
                          <div>
                            <span className="text-on-surface-variant">{g.playerId}:</span>{" "}
                            {g.guess?.trim() ? g.guess : "Incorrect guess"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-surface-container-highest rounded-lg border border-white/10 text-sm text-on-surface-variant">
                        No incorrect guesses yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Setter;