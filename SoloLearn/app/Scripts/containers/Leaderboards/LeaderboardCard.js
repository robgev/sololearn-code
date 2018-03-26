import React from 'react';
import { Link } from 'react-router';
import VisibilitySensor from 'react-visibility-sensor';
import texts from 'texts';
import UserCard from './UserCard';

const LeaderboardCard = ({
	userId,
	userRank,
	leaderboards,
	onScrollVisibility,
}) => (
	<div className="leaderboard-card-container">
		{
			leaderboards.map((user, index) => (
				<div className="leaderboard-card-wrapper" key={user.name}>
					{ (index === 10 && userRank > 10) && // after top 10
					<div className="leaderboard-next-banner">
						{ texts.next }
					</div>
					}
					{	user.userID === userId ?
						<VisibilitySensor
							scrollCheck
							scrollThrottle={100}
							onChange={onScrollVisibility}
						>
							<Link
								key={user.name}
								to={`/profile/${user.userID}`}
								id={`user-card-${user.userID}`}
								className="leaderboard-card  highlighted"
							>
								<UserCard {...user} />
							</Link>
						</VisibilitySensor> :
						<Link
							key={user.name}
							to={`/profile/${user.userID}`}
							id={`user-card-${user.userID}`}
							className="leaderboard-card"
						>
							<UserCard {...user} />
						</Link>
					}
				</div>
			))
		}
	</div>
);

export default LeaderboardCard;
