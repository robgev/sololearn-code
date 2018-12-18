import React, { PureComponent, Fragment } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { getLeaderboard, loadMore } from 'actions/leaderboards';
import BusyWrapper from 'components/BusyWrapper';
import LeaderboardShimmer from 'components/Shimmers/LeaderboardShimmer';
import texts from 'texts';
import { Layout, RaisedButton } from 'components/molecules';
import {
	Container,
	PaperContainer,
	Tabs,
	Tab,
	Select,
	MenuItem,
	Title,
} from 'components/atoms';
import { ArrowDown } from 'components/icons';
import { NoLocationCard } from './components';
import InfiniteLeaderboard from './InfiniteLeaderboard';
import LeaderboardCard from './LeaderboardCard';

import './index.scss';

const sendGoogleEvent = (mode) => {
	switch (mode) {
	case 0:
		ReactGA.ga('send', 'screenView', { screenName: 'Global Leaderboard Page' });
		break;
	case 1:
		ReactGA.ga('send', 'screenView', { screenName: 'Social Leaderboard Page' });
		break;
	case 2:
		ReactGA.ga('send', 'screenView', { screenName: 'Local Leaderboard Page' });
		break;
	default:
		break;
	}
};

const mapStateToProps =
	({ leaderboards, userProfile: { id: userId, countryCode } }) =>
		({ leaderboards, userId, countryCode });

@connect(mapStateToProps, { getLeaderboard, loadMore })
@translate()
class Leaderboards extends PureComponent {
	constructor(props) {
		super(props);
		const { params: { mode: modeValue, range: rangeValue, userId } } = props;
		const calculatedUserId = parseInt(userId || this.props.userId, 10);
		// Set default mode and turn into int in case it's not set
		const mode = modeValue ? parseInt(modeValue, 10) : 1;
		const range = rangeValue ? parseInt(rangeValue, 10) : 1; // Same thing
		this.state = {
			mode,
			range,
			userRank: -1,
			loading: true,
			startIndex: 0,
			loadCount: 20,
			hasMore: true,
			shouldHideButton: false,
			userId: calculatedUserId,
			loadingData: false,
		};
		sendGoogleEvent(mode);
		document.title = 'Sololearn | Leaderboards';
	}

	async componentDidMount() {
		const {
			mode, range, userId, startIndex, loadCount,
		} = this.state;
		const length = await this.props.getLeaderboard({
			mode,
			range,
			userId,
			index: startIndex,
			count: loadCount,
		}); // The last two are provisional params for initial load of all time leaderboard
		const userRank = this.findRank();
		this.setState({
			userRank,
			loading: false,
			startIndex: length,
			hasMore: length === loadCount,
		});
	}

	async componentWillReceiveProps(newProps) {
		const { loadCount } = this.state;
		const { params: newParams, leaderboards: newLeaderboards } = newProps;
		const { params, leaderboards } = this.props;
		if (newParams.mode !== params.mode || newParams.range !== params.range) {
			sendGoogleEvent(newParams.mode);
			const mode = parseInt(newParams.mode, 10);
			const range = parseInt(newParams.range, 10);
			this.setState({ loading: true, mode, range });
			const length = await this.props.getLeaderboard({ ...newParams, index: 0, count: 20 });
			this.setState({ startIndex: length, hasMore: length === loadCount });
		} else if (newLeaderboards.length !== leaderboards.length
			|| !isEqual(newLeaderboards, leaderboards)) {
			const userRank = this.findRank(newLeaderboards);
			this.setState({ loading: false, userRank });
		}
	}

	handleNextFetch = async () => {
		const {
			startIndex, loadCount, mode, userId,
		} = this.state;
		this.setState({ loadingData: true });
		const length = await this.props.loadMore({
			mode,
			userId,
			range: 0,
			count: loadCount,
			index: startIndex,
		});
		this.setState({
			hasMore: length === loadCount,
			startIndex: startIndex + length,
			loadingData: false,
		});
	}

	handleChange = (event) => {
		const { mode = 1, userId } = this.state;
		browserHistory.replace(`/leaderboards/${userId}/${mode}/${event.target.value}`);
	}

	tabChange = (event, value) => {
		const { range = 0, userId } = this.state;
		browserHistory.replace(`/leaderboards/${userId}/${value}/${range}`);
	}

	findRank = (newLeaderboards) => {
		const leaderboards = newLeaderboards || this.props.leaderboards;
		const { userId } = this.state;

		const targetUser = leaderboards.find(({ userID }) => userID === userId);
		return targetUser ? targetUser.rank : -1; // If the user is not found in the list, return - 1
	}

	scrollTo = () => {
		const { userId } = this.state;
		document.getElementById(`user-card-${userId}`).scrollIntoView({ block: 'center', behavior: 'smooth' });
	}

	onScrollVisibility = (shouldHideButton) => {
		this.setState({ shouldHideButton });
	}

	render() {
		const {
			t,
			countryCode,
			leaderboards,
			userId: currentUserId,
		} = this.props;
		const {
			mode,
			range,
			userId,
			loading,
			hasMore,
			userRank,
			shouldHideButton,
			loadingData,
		} = this.state;
		return (
			<Layout className="leaderboards-container">
				<PaperContainer className="leaderboards-header-container">
					<Container className="leaderboards-topbar">
						<Tabs onChange={this.tabChange} value={mode}>
							<Tab
								value={1}
								label={texts.following}
							/>
							<Tab
								value={2}
								label={texts.local}
							/>
							<Tab
								value={0}
								label={texts.global}
							/>
						</Tabs>
						<Select value={range} onChange={this.handleChange} displayEmpty>
							<MenuItem value={1}>{texts.today}</MenuItem>
							<MenuItem value={7}>{texts.thisWeek}</MenuItem>
							<MenuItem value={30}>{texts.thisMonth}</MenuItem>
							<MenuItem value={0}>{texts.allTime}</MenuItem>
						</Select>
					</Container>
				</PaperContainer>
				<PaperContainer>
					<BusyWrapper
						isBusy={loading}
						wrapperClassName="leaderboards-body"
						loadingComponent={<LeaderboardShimmer />}
					>
						{countryCode
							? (
								<Fragment>
									{
										leaderboards.length === 0 ?
											<Title>{t('leaderboard.no-social-message')}</Title>
											: range === 0 ?
												<InfiniteLeaderboard
													userId={userId}
													hasMore={hasMore}
													leaderboards={leaderboards}
													loadMore={this.handleNextFetch}
													onScrollVisibility={this.onScrollVisibility}
													isLoading={loadingData}
												/> :
												<LeaderboardCard
													userId={userId}
													leaderboards={leaderboards}
													isMine={currentUserId === userId}
													onScrollVisibility={this.onScrollVisibility}
												/>
									}
								</Fragment>
							)
							: <NoLocationCard />
						}
						{(userRank > 0 && countryCode && !shouldHideButton) &&
							<Container
								className="scroll-button-container"
							>
								<RaisedButton
									onClick={this.scrollTo}
									className="scroll-button"
								>
									{`${t(`leaderboard.action.${userId === this.props.userId ? 'find-me' : 'find-them'}`)} ${userRank}`}
									<ArrowDown />
								</RaisedButton>
							</Container>
						}
					</BusyWrapper>
				</PaperContainer>
			</Layout>
		);
	}
}

export default Leaderboards;
