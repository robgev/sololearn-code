// React modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

// Material UI components
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';

// Additional data and components
import UserList from './UserList';

const TabTypes = {
	Followers: 1,
	Following: 2,
};

const styles = {
	container: {
		position: 'relative',
		height: 500,
		overflowY: 'auto',
	},
	header: {
		display: 'flex',
	},
	tabsWrapper: {
		flex: 1,
	},
	tabs: {
		backgroundColor: '#fff',
	},
	tab: {
		color: 'rgba(107, 104, 104, 0.8)',
	},
};

@translate()
@observer
class FollowersBase extends Component {
	@observable activeTab = TabTypes.Followers;

	@action handleTabChange = (val) => {
		this.activeTab = val;
	}

	componentWillMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Followers Page' });
	}

	render() {
		const { t, open, closePopup } = this.props;
		const {
			followers, followings, getFollowers, getFollowings, onFollow,
		} = this.props.profile;
		return (
			<Dialog
				open={open}
				onRequestClose={closePopup}
			>
				<div style={styles.container}>
					<div style={styles.header}>
						<Tabs
							style={styles.tabsWrapper}
							value={this.activeTab}
							onChange={this.handleTabChange}
							tabItemContainerStyle={styles.tabs}
						>
							<Tab
								label={t('followers.tab.followers-title')}
								value={TabTypes.Followers}
								style={styles.tab}
							/>
							<Tab
								label={t('common.user-following')}
								value={TabTypes.Following}
								style={styles.tab}
							/>
						</Tabs>
						<IconButton className="close" onClick={closePopup}>
							<Close color={grey600} />
						</IconButton>
					</div>
					{	this.activeTab === TabTypes.Followers &&
						<UserList
							users={followers.entities}
							hasMore={followers.hasMore}
							loadMore={getFollowers}
							onFollowClick={onFollow}
						/>
					}
					{this.activeTab === TabTypes.Following &&
						<UserList
							users={followings.entities}
							hasMore={followings.hasMore}
							loadMore={getFollowings}
							onFollowClick={onFollow}
						/>
					}
				</div>
			</Dialog>
		);
	}
}

export default FollowersBase;
