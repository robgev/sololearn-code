import React from 'react';
import { translate } from 'react-i18next';
import VisibilitySensor from 'react-visibility-sensor';
import { Container, HorizontalDivider } from 'components/atoms';
import UserCard from './UserCard';

const LeaderboardCard = ({
	t,
	userId,
	isMine,
	leaderboards,
	onScrollVisibility,
}) => (
	<Container className="leaderboard-card-container">
		{
			leaderboards.map((user, index) => (
				<Container className="leaderboard-card-wrapper" key={user.name}>
					{ (index === 0
						? false
						: user.number - leaderboards[index - 1].number > 1
					) && // after top 10
						<Container className="leaderboard-next-banner">
							{ isMine ? t('leaderboard.header.own-title') : t('leaderboard.header.they-title') }
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

export default translate()(LeaderboardCard);
