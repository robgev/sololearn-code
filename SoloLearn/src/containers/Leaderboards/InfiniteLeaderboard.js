import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import {
	List,
	AutoSizer,
	WindowScroller,
} from 'react-virtualized';
import { loadMore } from 'actions/leaderboards';
import UserCard from './UserCard';

const mapDispatchToProps = {
	loadMore,
};

@connect(null, mapDispatchToProps, null, { withRef: true })
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
		const { leaderboards, userId, onScrollVisibility } = this.props;
		const user = leaderboards[index];
		return (
			<div
				key={key}
				style={style}
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
							className="leaderboard-card highlighted"
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
						<UserCard alltime {...user} />
					</Link>
				}
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

	scrollTo = (scrollIndex) => {
		this._list.scrollToRow(scrollIndex);
	}

	render() {
		const { leaderboards, scrollToIndex } = this.props;
		return (
			<WindowScroller ref={this._setRef}>
				{({
					height, registerChild, onChildScroll, scrollTop,
				}) => (
					<div style={{ flex: '1 1 auto ' }}>
						<AutoSizer disableHeight>
							{({ width }) => (
								<div ref={registerChild}>
									<List
										autoHeight
										width={width}
										rowHeight={51}
										height={height}
										scrollTop={scrollTop}
										overscanRowCount={2}
										onScroll={onChildScroll}
										scrollToAlignment="center"
										scrollToIndex={scrollToIndex}
										rowCount={leaderboards.length}
										ref={(list) => { this._list = list; }}
										onRowsRendered={this.handleNextFetch}
										className="leaderboard-card-container"
										rowRenderer={this.renderLeaderboardCard}
									/>
								</div>
							)}
						</AutoSizer>
					</div>
				)}
			</WindowScroller>
		);
	}
}

export default InfiniteLeaderboard;
