import React from 'react';
import { Link } from 'react-router';
import VisibilitySensor from 'react-visibility-sensor';
import InfiniteScroll from 'components/InfiniteScroll';
import UserCard from './UserCard';

const InfiniteLeaderboard = ({
	userId,
	hasMore,
	loadMore,
	leaderboards,
	onScrollVisibility,
}) => (
	<InfiniteScroll
		header={null}
		element="div"
		withLoader={false}
		initialLoad={false}
		hasMore={hasMore}
		loadMore={loadMore}
		containerStyle={{ zIndex: 1 }}
	>
		<div className="leaderboard-card-container">
			{
				leaderboards.map(user => (
					<div
						key={user.name}
						id={`user-card-${user.userID}`}
						className="leaderboard-card-wrapper"
					>
						{	user.userID === userId ?
							<VisibilitySensor
								scrollCheck
								scrollThrottle={100}
								intervalDelay={8000}
								onChange={onScrollVisibility}
							>
								<Link
									key={user.name}
									to={`/profile/${user.userID}`}
									id={`user-card-${user.userID}`}
									className="leaderboard-card highlighted hoverable"
								>
									<UserCard {...user} />
								</Link>
							</VisibilitySensor> :
							<Link
								key={user.name}
								to={`/profile/${user.userID}`}
								id={`user-card-${user.userID}`}
								className="leaderboard-card hoverable"
							>
								<UserCard alltime {...user} />
							</Link>
						}
					</div>
				))
			}
		</div>
	</InfiniteScroll>
);

export default InfiniteLeaderboard;
