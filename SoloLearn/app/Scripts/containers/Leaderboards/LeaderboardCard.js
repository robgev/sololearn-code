import React from 'react';
import { Link } from 'react-router';
import texts from 'texts';
import UserCard from './UserCard';

const LeaderboardCard = ({
	userId,
	leaderboards,
}) => (
	<div className="leaderboard-card-container">
		{
			leaderboards.map((user, index) => (
				<div className="leaderboard-card-wrapper" key={user.name}>
					{ index === 10 && // after top 10
					<div className="leaderboard-next-banner">
						{ texts.next }
					</div>
					}
					<Link
						key={user.name}
						to={`/profile/${user.userID}`}
						id={`user-card-${user.userID}`}
						className={`leaderboard-card ${user.userID === userId ? 'highlighted' : ''}`}
					>
						<UserCard {...user} />
					</Link>
				</div>
			))
		}
	</div>
);

export default LeaderboardCard;
