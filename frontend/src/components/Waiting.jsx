function Waiting({ gameId, playerId, game }) {
	const playerCount = game?.players ? Object.keys(game.players).length : 0;
	const ready = playerCount >= 2;

	return (
		<div className="app">
			<div className="shell">
				<div className="topbar">
					<div className="brand">
						<div className="logo" aria-hidden="true" />
						<div className="brandTitle">
							<strong>GeoGuess</strong>
							<span>Waiting Room</span>
						</div>
					</div>

					<span className="chip">
						<span className="muted">Player</span>
						<strong>{playerId}</strong>
					</span>
				</div>

				<div className="card">
					<div className="cardHeader">
						<h2 className="h2">Game Lobby</h2>
						<span className={`badge ${ready ? "badgeSuccess" : "badgeAccent"}`}>
							{ready ? "Starting" : "Waiting"}
						</span>
					</div>

					<div className="cardInner stack">
						<div className="toast toastAccent">
							<div className="rowWrap">
								<span className="muted">Game ID</span>
								<strong style={{ letterSpacing: ".18em" }}>{gameId}</strong>
								<span className="muted">•</span>
								<span className="muted">Players</span>
								<strong>{playerCount}/2</strong>
							</div>
							<div className="small" style={{ marginTop: 6 }}>
								Share the Game ID with your friend. Roles will be assigned automatically when 2 players join.
							</div>
						</div>

						{!ready ? (
							<div className="panel">
								<div className="panelHeader">
									<h4>What to do</h4>
								</div>
								<div className="scroll">
									<ul className="list">
										<li className="listItem">Invite Player 2 using the Game ID.</li>
										<li className="listItem">Once both join, you’ll be assigned Setter/Guesser.</li>
										<li className="listItem">Setter sets a city; Guesser guesses with hints.</li>
									</ul>
								</div>
							</div>
						) : (
							<div className="toast">
								Both players joined. Starting the round…
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Waiting;
