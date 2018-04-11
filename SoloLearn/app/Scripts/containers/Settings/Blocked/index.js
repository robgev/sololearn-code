import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
import BusyWrapper from 'components/Shared/BusyWrapper';
import { blockUser, getBlockedUsers } from 'actions/settings';
import UserCard from './UserCard';

const mapStateToProps = ({ settings: { blockedUsers } }) => ({ blockedUsers });

const mapDispatchToProps = {
	blockUser,
	getBlockedUsers,
};

@connect(mapStateToProps, mapDispatchToProps)
class Blocked extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: true,
			hasMore: true,
		};
	}

	async componentWillMount() {
		const { startIndex, loadCount } = this.state;
		const length = await this.props.getBlockedUsers({ index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
	}

	loadMore = async () => {
		const { startIndex, loadCount, loading } = this.state;
		if (!loading) {
			const length =
				await this.props.getBlockedUsers({ index: startIndex, count: loadCount });
			this.setState({
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
			});
		}
	}

	render() {
		const { blockedUsers, blockUser } = this.props;
		const {
			loading,
			hasMore,
		} = this.state;
		return (
			<BusyWrapper
				isBusy={loading}
				style={{ minHeight: '60vh' }}
				wrapperClassName="blocked-settings-container"
				loadingComponent={
					<CircularProgress
						size={100}
					/>
				}
			>
				<InfiniteScroll
					pageStart={0}
					hasMore={hasMore}
					loadMore={this.loadMore}
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
					}}
					loader={loading ? null : <CircularProgress />}
				>
					{blockedUsers.map(blockedUser => (
						<UserCard
							{...blockedUser}
							key={blockedUser.id}
							onBlock={() => blockUser({
								userId: blockedUser.id,
								block: !blockedUser.blockedState,
							})}
						/>
					))}
				</InfiniteScroll>
			</BusyWrapper>
		);
	}
}

export default Blocked;
