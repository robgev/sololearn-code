import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { getLeaderboard } from 'actions/leaderboards';
import Layout from 'components/Layouts/GeneralLayout';
import BusyWrapper from 'components/Shared/BusyWrapper';
import texts from 'texts';

import 'styles/Leaderboards/index.scss';

import InfiniteLeaderboard from './InfiniteLeaderboard';
import LeaderboardCard from './LeaderboardCard';

const mapStateToProps =
	({ leaderboards, userProfile: { id: userId } }) => ({ leaderboards, userId });

@connect(mapStateToProps, { getLeaderboard })
class Leaderboards extends PureComponent {
	constructor(props) {
		super(props);
		const { params: { mode: modeValue, range: rangeValue, id } } = props;
		const userId = id || this.props.userId;
		// Set default mode and turn into int in case it's not set
		const mode = modeValue ? parseInt(modeValue, 10) : 1;
		const range = rangeValue ? parseInt(rangeValue, 10) : 1; // Same thing
		this.state = {
			mode,
			range,
			userId,
			loading: true,
		};
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
		this.setState({ loading: false });
	}

	async componentWillReceiveProps(newProps) {
		const { params: newParams } = newProps;
		const { params } = this.props;
		if (newParams.mode !== params.mode || newParams.range !== params.range) {
			const mode = parseInt(newParams.mode, 10);
			const range = parseInt(newParams.range, 10);
			this.setState({ loading: true, mode, range });
			await this.props.getLeaderboard({ ...newParams, index: 0, count: 20 });
			this.setState({ loading: false });
		}
	}

	handleChange = (event, index, range) => {
		const { mode = 1, userId } = this.state;
		browserHistory.replace(`/leaderboards/${userId}/${mode}/${range}`);
	}

	render() {
		const { leaderboards } = this.props;
		const {
			mode,
			range,
			userId,
			loading,
		} = this.state;
		return (
			<Layout className="leaderboards-container">
				<div className="leaderboards-topbar">
					<div className="leaderboard-tabs">
						<Link
							to={`/leaderboards/${userId}/1/${range}`}
							className={`mode-item ${mode === 1 ? 'active' : ''}`}
						>
							{texts.following}
						</Link>
						<Link
							to={`/leaderboards/${userId}/2/${range}`}
							className={`mode-item ${mode === 2 ? 'active' : ''}`}
						>
							{texts.local}
						</Link>
						<Link
							to={`/leaderboards/${userId}/0/${range}`}
							className={`mode-item ${mode === 0 ? 'active' : ''}`}
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
				>
					{ range === 0 ?
						<InfiniteLeaderboard
							mode={mode}
							userId={userId}
							leaderboards={leaderboards}
						/> :
						<LeaderboardCard userId={userId} leaderboards={leaderboards} />
					}
				</BusyWrapper>
			</Layout>
		);
	}
}

export default Leaderboards;
