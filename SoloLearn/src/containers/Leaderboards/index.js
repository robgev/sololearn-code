import React, { PureComponent, Fragment } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { getLeaderboard, setFilters, loadMore } from 'actions/leaderboards';
import {
	DEFAULT_FILTERS,
	leaderboardsFiltersSelector,
	leaderboardsDataSelector,
} from 'reducers/leaderboards.reducer';
import { queryDifference } from 'utils';
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

const TABS = {
	following: 1,
	local: 2,
	global: 0,
};
const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);

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

const mapStateToProps = state => ({
	leaderboards: leaderboardsDataSelector(state),
	filters: leaderboardsFiltersSelector(state),
	userId: state.userProfile.id,
	countryCode: state.userProfile.countryCode,
});

@connect(mapStateToProps, { getLeaderboard, setFilters, loadMore })
@translate()
class Leaderboards extends PureComponent {
	constructor(props) {
		super(props);
		const { params: { userId } } = props;
		const calculatedUserId = parseInt(userId || this.props.userId, 10);
		this.state = {
			userRank: -1,
			loading: true,
			startIndex: 0,
			loadCount: 20,
			hasMore: true,
			shouldHideButton: false,
			userId: calculatedUserId,
			loadingData: false,
		};
		document.title = 'Sololearn | Leaderboards';
	}

	async componentDidMount() {
		const {
			userId, startIndex, loadCount,
		} = this.state;
		const { location, filters, params: { tab } } = this.props;
		const query = {
			...filters,
			...location.query,
			mode: TABS[tab],
		};
		this.props.setFilters(query);
		const changed = queryDifference(DEFAULT_FILTERS, query);
		browserHistory.replace({ ...location, query: changed });
		const length = await this.props.getLeaderboard({
			userId,
			mode: TABS[tab],
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
		sendGoogleEvent(this.props.filters.mode);
	}

	async componentWillReceiveProps(newProps) {
		const { userId, loadCount } = this.state;
		const {
			location: newLocation,
			leaderboards: newLeaderboards,
			params: { tab },
		} = newProps;
		if (!tab || TABS[tab] === undefined) {
			browserHistory.replace({
				...newLocation,
				query: { ...newLocation.query },
				pathname: '/leaderboard/following',
			});
			return;
		}
		const { location, leaderboards } = this.props;
		if (!isEqual(newLocation.query, location.query) || tab !== this.props.params.tab) {
			this.setState({ loading: true });
			sendGoogleEvent(newProps.filters.mode);
			// Check against default filters and show only the ones that are different
			// From the defaults in the address bar
			const changed = queryDifference(DEFAULT_FILTERS, newLocation.query);
			browserHistory.replace({ ...newLocation, query: changed });
			// Keep the redux filters up to date with the route url
			this.props.setFilters({ ...DEFAULT_FILTERS, ...newLocation.query, mode: TABS[tab] });
			// Fetch and send google event
			const length = await this.props.getLeaderboard({
 userId, mode: TABS[tab], index: 0, count: 20
});
			this.setState({ loading: false, startIndex: length, hasMore: length === loadCount });
		} else if (newLeaderboards.length !== leaderboards.length
			|| !isEqual(newLeaderboards, leaderboards)) {
			const userRank = this.findRank(newLeaderboards);
			this.setState({ userRank });
		}
	}

	handleNextFetch = async () => {
		const {
			startIndex, loadCount, userId,
		} = this.state;
		this.setState({ loadingData: true });
		const length = await this.props.loadMore({
			userId,
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
		const { location } = this.props;
		browserHistory.replace({
			...location,
			query: { ...location.query, range: event.target.value },
		});
	}

	tabChange = (_, value) => {
		const { location } = this.props;
		browserHistory.replace({
			...location,
			query: { ...location.query },
			pathname: `/leaderboard/${getKeyByValue(TABS, value)}`,
		});
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
			filters,
			countryCode,
			leaderboards,
			userId: currentUserId,
			params:{ tab }
		} = this.props;
		const {
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
						<Tabs onChange={this.tabChange} value={TABS[tab]}>
							<Tab
								value={TABS.following}
								label={texts.following}
							/>
							<Tab
								value={TABS.local}
								label={texts.local}
							/>
							<Tab
								value={TABS.global}
								label={texts.global}
							/>
						</Tabs>
						<Select value={filters.range} onChange={this.handleChange} displayEmpty>
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
											: filters.range === 0 ?
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
									{`${t(`leaderboard.action.${userId === currentUserId ? 'find-me' : 'find-them'}`)} ${userRank}`}
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
