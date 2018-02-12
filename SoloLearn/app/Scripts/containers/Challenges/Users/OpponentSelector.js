// General modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Material UI components
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import { grey600 } from 'material-ui/styles/colors';

// Redux modules
import { chooseContestCourse } from 'actions/challenges';
import { isLoaded } from 'reducers';

// Additional data and components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Layout from 'components/Layouts/GeneralLayout';

// Utils
import { EnumNameMapper } from 'utils';

// Local components
import Followers from './Followers';
import Following from './Following';
import AllPlayers from './AllPlayers';

const TabTypes = {
	AllPlayers: 0,
	Followers: 1,
	Following: 2,
};
EnumNameMapper.apply(TabTypes);

const styles = {

	tabsWrapper: {
		flex: 1,
	},

	tabs: {
		backgroundColor: '#fff',
	},

	tab: {
		color: 'rgba(107, 104, 104, 0.8)',
	},

	inkBarStyle: {
		backgroundColor: '#777',
	},
};

class OpponentSelector extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeTab: TabTypes.AllPlayers,
		};
	}

	handleTabChange(value) {
		this.setState({ activeTab: value });
	}

	render() {
		const userId = this.props.userId;

		if (!isLoaded) {
			return <LoadingOverlay />;
		}

		return (
			<Layout>
				<Paper>
					<Tabs value={this.state.activeTab} style={styles.tabsWrapper} tabItemContainerStyle={styles.tabs} inkBarStyle={styles.inkBarStyle}>
						<Tab
							label="All Players"
							value={TabTypes.AllPlayers}
							style={styles.tab}
							onClick={() => this.handleTabChange(TabTypes.AllPlayers)}
						/>
						<Tab
							label="Followers"
							value={TabTypes.Followers}
							style={styles.tab}
							onClick={() => this.handleTabChange(TabTypes.Followers)}
						/>
						<Tab
							label="Following"
							value={TabTypes.Following}
							style={styles.tab}
							onClick={() => this.handleTabChange(TabTypes.Following)}
						/>
					</Tabs>
					{this.state.activeTab == TabTypes.AllPlayers && <AllPlayers /> }
					{this.state.activeTab == TabTypes.Followers && <Followers />}
					{this.state.activeTab == TabTypes.Following && <Following />}
				</Paper>
			</Layout>
		);
	}

	componentDidMount() {
		const { isLoaded } = this.props;

		if (!isLoaded) {
			browserHistory.replace('/contests');
		}
	}

	// Set contest course null
	componentWillUnmount() {
		this.props.chooseContestCourse(null);
	}
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'opponentSelector'),
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		chooseContestCourse,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OpponentSelector);
