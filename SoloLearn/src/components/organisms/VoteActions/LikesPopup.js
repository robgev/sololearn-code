import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import UserList from 'containers/Profile/UserList';
import { determineAccessLevel } from 'utils';
import {
	Tab,
	Tabs,
	Popup,
	PopupTitle,
	PopupContent,
} from 'components/atoms';

const TabTypes = {
	upvotes: 'UPVOTES',
	downvotes: 'DOWNVOTES',
};

const mapStateToProps = state => ({
	canAccessDownvotes: determineAccessLevel(state.userProfile.accessLevel) > 2,
});

@observer
@connect(mapStateToProps)
@translate()
class Likes extends Component {
	state = {
		activeTab: TabTypes.upvotes,
	}

	handleTabChange = (_, activeTab) => {
		this.setState({ activeTab });
	}

	render() {
		const {
			t,
			open,
			onClose,
			canAccessDownvotes,
		} = this.props;
		const { activeTab } = this.state;
		const {
			upvotes,
			onFollow,
			downvotes,
			getUpvotes,
			getDownvotes,
		} = this.props.likes;
		return (
			<Popup
				open={open}
				onClose={onClose}
			>
				{/* style={{ display: 'flex' }} */}
				<PopupTitle>
					<Tabs
						style={{ flex: 1 }}
						onChange={this.handleTabChange}
						value={canAccessDownvotes ? activeTab : TabTypes.upvotes}
						inkBarContainerStyle={!canAccessDownvotes ? { display: 'none' } : null}
					>
						<Tab
							label={t('upvotes.title')}
							value={TabTypes.upvotes}
						/>
						{ canAccessDownvotes &&
						<Tab
							label={t('downvotes.title')}
							value={TabTypes.downvotes}
						/>
						}
					</Tabs>
				</PopupTitle>
				{/* style={{
					height: '50vh',
					position: 'relative',
					overflowY: 'auto',
				}} */}
				<PopupContent>
					{activeTab === TabTypes.upvotes &&
					<UserList
						users={upvotes.entities}
						hasMore={upvotes.hasMore}
						loadMore={getUpvotes}
						onFollowClick={onFollow}
					/>
					}
					{activeTab === TabTypes.downvotes &&
					<UserList
						users={downvotes.entities}
						hasMore={downvotes.hasMore}
						loadMore={getDownvotes}
						onFollowClick={onFollow}
					/>
					}
				</PopupContent>
			</Popup>
		);
	}
}

export default Likes;
