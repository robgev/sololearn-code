import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
//import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
import BusyWrapper from 'components/BusyWrapper';
import { blockUser, getBlockedUsers } from 'actions/settings';

import { Container, Loading, TextBlock } from 'components/atoms';
import { InfiniteScroll } from 'components/molecules';

import UserCard from './UserCard';

const mapStateToProps = ({ settings: { blockedUsers } }) => ({ blockedUsers });

const mapDispatchToProps = {
	blockUser,
	getBlockedUsers,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Blocked extends PureComponent {
	constructor() {
		super();
		this.state = {
			startIndex: 0,
			loadCount: 10,
			loading: false,
			hasMore: true,
		};
	}

	/*async componentWillMount() {
		const { startIndex, loadCount } = this.state;
		const length = await this.props.getBlockedUsers({ index: startIndex, count: loadCount });
		this.setState({
			loading: false,
			hasMore: length === loadCount,
			startIndex: startIndex + loadCount,
		});
		ReactGA.ga('send', 'screenView', { screenName: 'Blocked Users Page' });
	}*/

	componentDidMount = () => {
		this.loadMore();
	}

	loadMore = async () => {
		const { startIndex, loadCount, loading } = this.state;
		if (!loading) {
			this.setState({loading:true});
			const length =
				await this.props.getBlockedUsers({ index: startIndex, count: loadCount });
			this.setState({
				hasMore: length === loadCount,
				startIndex: startIndex + loadCount,
				loading:false,
			});
		}
	}

	render() {
		const { t,  blockUser, blockedUsers } = this.props;
		//const blockedUsers = [];
		const {
			loading,
			hasMore,
		} = this.state;
		return (
			!blockedUsers.length && !loading ?
				<TextBlock>{t('common.empty-list-message')}</TextBlock> :
				<InfiniteScroll
					pageStart={0}
					hasMore={hasMore}
					loadMore={this.loadMore}
					isLoading={loading}
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
		);
	}
}

export default Blocked;
