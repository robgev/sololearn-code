import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
	List,
	WindowScroller,
} from 'react-virtualized';
import { loadMore } from 'actions/leaderboards';
import UserCard from './UserCard';

const mapDispatchToProps = {
	loadMore,
};

@connect(null, mapDispatchToProps)
class InfiniteLeaderboard extends PureComponent {
	constructor() {
		super();
		this.state = {
			hasMore: true,
			startIndex: 20,
			loadCount: 20,
		};
	}

	renderLeaderboardCard = ({
		key,
		style,
		index,
	}) => {
		const user = this.props.leaderboards[index];
		return (
			<div
				key={key}
				style={style}
				className="leaderboard-card-wrapper"
			>
				<Link
					to={`/profile/${user.userID}`}
					className="leaderboard-card"
				>
					<UserCard {...user} />
				</Link>
			</div>
		);
	}

	handleNextFetch = async ({ stopIndex }) => {
		const { hasMore } = this.state;
		const { leaderboards, loadMore } = this.props;
		if (stopIndex > leaderboards.length - 6 && hasMore) {
			const { startIndex, loadCount } = this.state;
			const { mode, userId } = this.props;
			const length = await loadMore({
				mode,
				userId,
				range: 0,
				count: loadCount,
				index: startIndex,
			});
			this.setState({
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		}
	}

	render() {
		const { leaderboards } = this.props;
		console.log(leaderboards, 'LALALA');
		return (
			<WindowScroller>
				{
					({ height, scrollTop }) => (
						<List
							autoHeight
							width={960}
							rowHeight={51}
							height={height}
							scrollTop={scrollTop}
							rowCount={leaderboards.length}
							ref={(list) => { this._list = list; }}
							onRowsRendered={this.handleNextFetch}
							className="leaderboard-card-container"
							rowRenderer={this.renderLeaderboardCard}
						/>
					)
				}
			</WindowScroller>
		);
	}
}

export default InfiniteLeaderboard;
