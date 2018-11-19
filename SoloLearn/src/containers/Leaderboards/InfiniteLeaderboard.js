import React from 'react';
import { Link } from 'react-router';
import VisibilitySensor from 'react-visibility-sensor';
import { InfiniteScroll } from 'components/molecules';
import UserCard from './UserCard';
import { Container, HorizontalDivider } from 'components/atoms';

const InfiniteLeaderboard = ({
	userId,
	hasMore,
	loadMore,
	leaderboards,
	onScrollVisibility,
	isLoading,
}) => (
	<InfiniteScroll
		isLoading={isLoading}
		hasMore={hasMore}
		loadMore={loadMore}
	>
		<Container className="leaderboard-card-container">
			{
				leaderboards.map(user => {
					user.id = user.userID;
					return (
						<Container
							key={user.name}
							id={`user-card-${user.userID}`}
							className="leaderboard-card-wrapper"
						>
							<Container className="leaderboard-card">
								{	user.userID === userId ?
									<VisibilitySensor
										scrollCheck
										scrollThrottle={100}
										intervalDelay={8000}
										onChange={onScrollVisibility}
									>
										<UserCard user={user}/>
									</VisibilitySensor> :
									<UserCard user={user} />
								}
							</Container>
							<HorizontalDivider/>
						</Container>
				)})
			}

		</Container>
	</InfiniteScroll>
);

export default InfiniteLeaderboard;
