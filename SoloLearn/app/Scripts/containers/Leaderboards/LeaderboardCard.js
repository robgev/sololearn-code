import React from 'react';
import { Link } from 'react-router';
import texts from 'texts';
import UserCard from './UserCard';

const LeaderboardCard = ({ leaderboards }) => (
	<div className="leaderboard-card-container">
		{
			leaderboards.map((user, index) => (
				<div className="leaderboard-card-wrapper">
					{ index === 10 && // after top 10
					<div className="leaderboard-next-banner">
						{ texts.next }
					</div>
					}
					<Link
						key={user.name}
						to={`/profile/${user.userID}`}
						className="leaderboard-card"
					>
						<UserCard {...user} />
					</Link>
				</div>
			))
		}
	</div>
);

export default LeaderboardCard;
