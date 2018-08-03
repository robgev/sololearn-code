import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { translate } from 'react-i18next';

import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import { getLeaderboard } from 'actions/leaderboards';

import Layout from 'components/Layouts/GeneralLayout';
import BusyWrapper from 'components/BusyWrapper';
import LeaderboardShimmer from 'components/Shimmers/LeaderboardShimmer';
import texts from 'texts';

import 'styles/Leaderboards/index.scss';

import InfiniteLeaderboard from './InfiniteLeaderboard';
import LeaderboardCard from './LeaderboardCard';

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
	({ leaderboards, userProfile: { id: userId } }) => ({ leaderboards, userId });

@connect(mapStateToProps, { getLeaderboard })
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
			scrollToIndex: 0,
			shouldHideButton: false,
			userId: calculatedUserId,
		};
		sendGoogleEvent(mode);
		document.title = 'Sololearn | Leaderboards';
	}

	async componentWillMount() {
		const { mode, range, userId } = this.state;
		await this.props.getLeaderboard({
			mode,
			range,
			userId,
			index: 0,
			count: 20,
		}); // The last two are provisional params for initial load of all time leaderboard
		const userRank = this.findRank();
		this.setState({ loading: false, userRank });
	}

	async componentWillReceiveProps(newProps) {
		const { params: newParams, leaderboards: newLeaderboards } = newProps;
		const { params, leaderboards } = this.props;
		if (newParams.mode !== params.mode || newParams.range !== params.range) {
			sendGoogleEvent(newParams.mode);
			const mode = parseInt(newParams.mode, 10);
			const range = parseInt(newParams.range, 10);
			this.setState({ loading: true, mode, range });
			await this.props.getLeaderboard({ ...newParams, index: 0, count: 20 });
		} else if (newLeaderboards.length !== leaderboards.length) {
			const userRank = this.findRank(newLeaderboards);
			this.setState({ loading: false, userRank });
		}
	}

	handleChange = (event, index, range) => {
		const { mode = 1, userId } = this.state;
		browserHistory.replace(`/leaderboards/${userId}/${mode}/${range}`);
	}

	findRank = (newLeaderboards) => {
		const leaderboards = newLeaderboards || this.props.leaderboards;
		const { userId } = this.state;

		const targetUser = leaderboards.find(({ userID }) => userID === userId);
		return targetUser ? targetUser.rank : -1; // If the user is not found in the list, return - 1
	}

	scrollTo = () => {
		const { userId, range, userRank } = this.state;
		if (range === 0) {
			this.infiniteBoard.getWrappedInstance().scrollTo(userRank);
		} else {
			document.getElementById(`user-card-${userId}`).scrollIntoView({ block: 'center', behavior: 'smooth' });
		}
	}

	onScrollVisibility = (shouldHideButton) => {
		this.setState({ shouldHideButton });
	}

	render() {
		const { leaderboards, t } = this.props;
		const {
			mode,
			range,
			userId,
			loading,
			userRank,
			scrollToIndex,
			shouldHideButton,
		} = this.state;

		return (
			<Layout className="leaderboards-container">
				<Paper>
					<div className="leaderboards-topbar">
						<div className="leaderboard-tabs">
							<Link
								to={`/leaderboards/${userId}/1/${range}`}
								className={`hoverable mode-item ${mode === 1 ? 'active' : ''}`}
							>
								{texts.following}
							</Link>
							<Link
								to={`/leaderboards/${userId}/2/${range}`}
								className={`hoverable mode-item ${mode === 2 ? 'active' : ''}`}
							>
								{texts.local}
							</Link>
							<Link
								to={`/leaderboards/${userId}/0/${range}`}
								className={`hoverable mode-item ${mode === 0 ? 'active' : ''}`}
							>
								{texts.global}
							</Link>
						</div>
						<DropDownMenu value={range} onChange={this.handleChange}>
							<MenuItem value={1} primaryText={texts.today} />
							<MenuItem value={7} primaryText={texts.thisWeek} />
							<MenuItem value={30} primaryText={texts.thisMonth} />
							<MenuItem value={0} primaryText={texts.allTime} />
						</DropDownMenu>
					</div>
					<BusyWrapper
						isBusy={loading}
						style={{ minHeight: '30vh' }}
						wrapperClassName="leaderboards-body"
						loadingComponent={<LeaderboardShimmer />}
					>
						{ range === 0 ?
							<InfiniteLeaderboard
								mode={mode}
								userId={userId}
								leaderboards={leaderboards}
								scrollToIndex={scrollToIndex}
								onScrollVisibility={this.onScrollVisibility}
								ref={(infiniteBoard) => { this.infiniteBoard = infiniteBoard; }}
							/> :
							<LeaderboardCard
								userId={userId}
								userRank={userRank}
								leaderboards={leaderboards}
								onScrollVisibility={this.onScrollVisibility}
							/>
						}
						{ (userRank > 0 && !shouldHideButton) &&
						<RaisedButton
							labelColor="#FFFFFF"
							onClick={this.scrollTo}
							labelPosition="before"
							className="scroll-button"
							backgroundColor="#78909C"
							style={{ borderRadius: 100 }}
							buttonStyle={{ borderRadius: 100 }}
							label={`${t(`leaderboard.action.${userId === this.props.userId ? 'find-me' : 'find-them'}`)} ${userRank}`}
							icon={<ArrowDown />}
						/>
						}
					</BusyWrapper>
				</Paper>
			</Layout>
		);
	}
}

export default Leaderboards;
