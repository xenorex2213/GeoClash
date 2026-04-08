import { useState } from "react";

function Login({ setPlayerId }) {
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (!input) return alert("Enter Player ID");
    setPlayerId(input.trim().toLowerCase());
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex items-center justify-center overflow-x-hidden py-12 relative">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-surface-dim" />
        <div className="absolute inset-0 tech-grid" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[120px]" />
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" />
      </div>

      <main className="relative z-10 w-full max-w-[480px] px-6">
        <div className="bg-surface-variant/40 backdrop-blur-2xl rounded-xl glass-edge p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-primary/10">
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4">
              <span className="material-symbols-outlined text-primary text-5xl drop-shadow-[0_0_12px_rgba(164,255,185,0.6)]">explore</span>
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(164,255,185,0.4)]">GeoGuess</h1>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">Kinetic Explorer Protocol</p>
          </div>

          <section>
            <h2 className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-6 flex items-center gap-4">
              <span className="h-px grow bg-outline-variant/30" />
              Direct Entry
              <span className="h-px grow bg-outline-variant/30" />
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5" htmlFor="playerId">
                Identity / Player ID
              </label>
              <input
                id="playerId"
                className="w-full !bg-[#121414] border border-primary/25 rounded-md px-4 py-3 !text-[#EAF0FF] placeholder:!text-[#8792ad] caret-primary font-headline tracking-widest text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="EXPLORER_01"
                autoComplete="off"
              />
              <div className="text-[10px] text-on-surface-variant mt-2 uppercase tracking-wider">Use a short unique ID.</div>
            </div>

              <button className="w-full group py-3 rounded-md border border-primary/20 text-primary font-label text-[11px] uppercase tracking-widest hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2" type="submit">
                Connect As Guest
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;