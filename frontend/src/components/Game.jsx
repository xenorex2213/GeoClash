function Game({ gameId, playerId, game, children }) {
	const player = game?.players?.[playerId];

	return (
		<div className="app">
			<div className="shell">
				<div className="topbar">
					<div className="brand">
						<div className="logo" aria-hidden="true" />
						<div className="brandTitle">
							<strong>GeoGuess</strong>
							<span>In Game</span>
						</div>
					</div>

					<div className="rowWrap">
						<span className="chip">
							<span className="muted">Game</span>
							<strong style={{ letterSpacing: ".18em" }}>{gameId}</strong>
						</span>
						<span className="chip">
							<span className="muted">Round</span>
							<strong>
								{game.currentRound}/{game.totalRounds}
							</strong>
						</span>
						<span className={`badge ${game.status === "playing" ? "badgeSuccess" : "badgeAccent"}`}>
							{game.status}
						</span>
					</div>
				</div>

				<div className="grid">
					<div className="card">
						<div className="cardHeader">
							<h2 className="h2">Your Status</h2>
							<span className={`badge ${player?.role === "setter" ? "badgeAccent" : "badgeSuccess"}`}>
								{player?.role || "unassigned"}
							</span>
						</div>

						<div className="cardInner stack">
							<div className="panel">
								<div className="panelHeader">
									<h4>Scores</h4>
									<span className="small">Round starts at 100</span>
								</div>
								<div className="scroll">
									<div className="kv">
										<span>Round score</span>
										<strong>{player?.roundScore ?? "—"}</strong>
										<span>Total score</span>
										<strong>{player?.totalScore ?? "—"}</strong>
										<span>Wrong attempts</span>
										<strong>{game?.wrongAttempts ?? 0}</strong>
									</div>
								</div>
							</div>

							<div className="panel">
								<div className="panelHeader">
									<h4>Hints Revealed</h4>
									<span className="small">Updates each wrong guess</span>
								</div>
								<div className="scroll">
									{game?.revealedHints?.length ? (
										<ul className="list">
											{game.revealedHints.map((h, i) => (
												<li className="listItem" key={i}>
													{h}
												</li>
											))}
										</ul>
									) : (
										<div className="small">No hints revealed yet.</div>
									)}
								</div>
							</div>

							<div className="panel">
								<div className="panelHeader">
									<h4>Guess Feed</h4>
									<span className="small">Latest guesses</span>
								</div>
								<div className="scroll">
									{game?.guesses?.length ? (
										<ul className="list">
											{game.guesses.map((g, i) => (
												<li className="listItem" key={i}>
													<strong>{g.playerId}</strong>
													<span className="muted"> guessed </span>
													<strong>{g.guess}</strong>
												</li>
											))}
										</ul>
									) : (
										<div className="small">No guesses yet.</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="card">
						<div className="cardHeader">
							<h2 className="h2">Round Actions</h2>
							<span className="chip">
								<span className="muted">You</span>
								<strong>{playerId}</strong>
							</span>
						</div>
						<div className="cardInner">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Game;
