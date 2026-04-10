function Waiting({ gameId, playerId, game }) {
	const playerCount = game?.players ? Object.keys(game.players).length : 0;
	const ready = playerCount >= 2;

	return (
		<div className="bg-surface text-on-surface min-h-screen relative overflow-hidden">
			<nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10">
				<div className="flex justify-between items-center w-full px-6 py-4">
					<div className="font-headline text-2xl font-bold tracking-tighter text-primary">GeoClash</div>
					<div className="text-right">
						<div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Connected as</div>
						<div className="text-sm font-bold text-primary font-headline">{playerId}</div>
					</div>
				</div>
			</nav>

			<main className="min-h-screen pt-24 flex flex-col items-center justify-center relative overflow-hidden px-6">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] -z-10" />

				<section className="w-full max-w-4xl">
					<div className="text-center mb-10">
						<h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-primary">LOBBY</h1>
						<p className="text-on-surface-variant tracking-widest uppercase text-xs mt-2">Awaiting second explorer</p>
					</div>

					<div className="glass-card rounded-xl p-8 border border-white/10">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							<div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
								<div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Game ID</div>
								<div className="text-xl font-headline font-bold tracking-[0.2em] mt-1">{gameId}</div>
							</div>
							<div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
								<div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Players</div>
								<div className="text-xl font-headline font-bold mt-1">{playerCount}/2</div>
							</div>
							<div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20">
								<div className="text-[10px] uppercase tracking-widest text-on-surface-variant">Status</div>
								<div className={`text-sm font-bold uppercase tracking-widest mt-2 ${ready ? "text-primary" : "text-tertiary"}`}>
									{ready ? "Starting" : "Waiting"}
								</div>
							</div>
						</div>

						{!ready ? (
							<div className="space-y-3">
								<div className="text-xs uppercase tracking-widest text-on-surface-variant">Mission checklist</div>
								<div className="p-4 rounded-lg bg-surface-container-highest border border-outline-variant/20 text-sm">Share the Game ID with Player 2.</div>
								<div className="p-4 rounded-lg bg-surface-container-highest border border-outline-variant/20 text-sm">When both join, roles are assigned automatically.</div>
								<div className="p-4 rounded-lg bg-surface-container-highest border border-outline-variant/20 text-sm">Setter locks location, Guesser starts mission.</div>
							</div>
						) : (
							<div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium">
								Both players joined. Initializing round...
							</div>
						)}
					</div>
				</section>
			</main>
		</div>
	);
}

export default Waiting;
