// React modules
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import {
	Container,
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	Tabs,
	Tab,
} from 'components/atoms';
import UserList from './UserList';

const TabTypes = {
	Followers: 1,
	Following: 2,
};

@translate()
@observer
class FollowersBase extends Component {
	@observable activeTab = TabTypes.Followers;

	@action handleTabChange = (event, val) => {
		this.activeTab = val;
	}

	componentWillMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Followers Page' });
	}

	render() {
		const { t, open, closePopup } = this.props;
		const {
			followers, followings, getFollowers, getFollowings, onFollow, loadingFollowers, loadingFollowings
		} = this.props.profile;
		return (
			<Popup
				open={open}
				onClose={closePopup}
				autoScrollBodyContent
			>
				<PopupTitle>
					<Tabs
						value={this.activeTab}

						onChange={this.handleTabChange}
					>
						<Tab
							label={t('followers.tab.followers-title')}
							value={TabTypes.Followers}
						/>
						<Tab
							label={t('common.user-following')}
							value={TabTypes.Following}
						/>
					</Tabs>
				</PopupTitle>
				<PopupContent>
					<PopupContentText>
						<Container style={{width: '500px'}}>
							{this.activeTab === TabTypes.Followers &&
								<UserList
									users={followers.entities}
									hasMore={followers.hasMore}
									loadMore={getFollowers}
									onFollowClick={onFollow}
									loading={loadingFollowers}
								/>
							}
							{this.activeTab === TabTypes.Following &&
								<UserList
									users={followings.entities}
									hasMore={followings.hasMore}
									loadMore={getFollowings}
									loading={loadingFollowings}
									onFollowClick={onFollow}
								/>
							}
						</Container>
					</PopupContentText>
				</PopupContent>
			</Popup>
		);
	}
}

export default FollowersBase;
