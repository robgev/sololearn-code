import React from 'react';
import 'styles/components/Shimmers/LeaderboardShimmer.scss';

const LeaderboardShimmer = () => (
	<div className="leaderboard-shimmer-wrapper">
		{Array(20).fill(0).map((_, i) => (
			<div className="leaderboard-shimmer-container" key={i}>
				<div className="avatar" />
				<div className="leaderboard-text-info">
					<div className="leaderboard-line long" />
					<div className="leaderboard-line short" />
				</div>
				<div className="leaderboard-shimmer-shimmer" />
			</div>
		))}
	</div>
);

export default LeaderboardShimmer;
