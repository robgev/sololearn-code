import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import texts from 'texts';
import { Container, HorizontalDivider } from 'components/atoms';
import UserCard from './UserCard';

const LeaderboardCard = ({
	userId,
	userRank,
	leaderboards,
	onScrollVisibility,
}) => (
	<Container className="leaderboard-card-container">
		{
			leaderboards.map((user, index) => (
				<Container className="leaderboard-card-wrapper" key={user.name}>
					{ (index === 10 && userRank > 10) && // after top 10
						<Container className="leaderboard-next-banner">
							{ texts.next }
						</Container>
					}
					<Container className={`leaderboard-card ${user.userID === userId ? ' highlighted' : ''}`} id={`user-card-${user.userID}`}>
						{	user.userID === userId ?
							<VisibilitySensor
								scrollCheck
								scrollThrottle={100}
								onChange={onScrollVisibility}
							>
								<UserCard user={user} />
							</VisibilitySensor> :
							<UserCard user={user} />
						}
					</Container>
					<HorizontalDivider />
				</Container>
			))
		}
	</Container>
);

export default LeaderboardCard;
