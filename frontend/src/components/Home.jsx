function Home({ onPlay, onLogin, onSignup }) {
  return (
    <div className="text-on-background bg-surface min-h-screen overflow-x-hidden selection:bg-primary selection:text-on-primary">
      <header className="fixed top-0 w-full z-50 bg-[#0d0f0f] border-b border-[#a4ffb9]/15 shadow-[0_0_20px_rgba(164,255,185,0.05)]">
        <nav className="flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto font-headline tracking-tight">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter text-[#8CFFB3] drop-shadow-[0_0_10px_rgba(140,255,179,0.22)] uppercase">GeoClash</span>
            <div className="hidden md:flex gap-6 items-center">
              <span className="text-[#a4ffb9] border-b-2 border-[#a4ffb9] text-sm font-medium">Explore</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/*<div className="flex gap-2 mr-4">
              <span className="material-symbols-outlined text-[#a4ffb9] cursor-pointer hover:opacity-80">language</span>
              <span className="material-symbols-outlined text-[#a4ffb9] cursor-pointer hover:opacity-80">public</span>*
            </div>*/}
            <button type="button" onClick={onLogin} className="px-4 py-2 text-slate-400 text-sm font-medium hover:bg-[#a4ffb9]/10 rounded active:scale-95">
              Login
            </button>
            <button type="button" onClick={onSignup} className="px-5 py-2 bg-[#a4ffb9] text-[#006532] font-bold text-sm rounded shadow-lg hover:shadow-[#a4ffb9]/20 active:scale-95">
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      <main className="relative pt-24">
        <section className="relative min-h-[calc(100vh-96px)] flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 topo-overlay pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl w-full text-center">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary whitespace-nowrap">Live Multiplayer Recon</span>
              </div>
            </div>

            <h1 className="inline-block font-headline text-7xl md:text-9xl font-extrabold tracking-tighter mb-6 text-white leading-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:-translate-y-1">
              GEO<span className="text-[#A4FFB9]">CLASH</span>
            </h1>

            <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              Precision Navigation &amp; Global Reconnaissance. Challenge your perception in the ultimate multiplayer geospatial hunt.
            </p>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={onPlay}
                className="group relative w-full max-w-[360px] px-10 py-5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-lg rounded-lg shadow-[0_0_30px_rgba(164,255,185,0.3)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(164,255,185,0.5)] active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 uppercase tracking-widest">Play Now</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-12 left-12 font-headline text-[10px] tracking-[0.3em] text-on-surface-variant/40 hidden lg:block">
            LAT 48.8584° N <br /> LON 2.2945° E
          </div>
          <div className="absolute bottom-12 right-12 font-headline text-[10px] tracking-[0.3em] text-on-surface-variant/40 hidden lg:block text-right">
            ALT 35,000 FT <br /> PRECISION 0.001M
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
