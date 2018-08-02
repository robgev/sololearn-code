import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';
import UserList from 'containers/Profile/UserList';
import { determineAccessLevel } from 'utils';
import ILikes from './ILikes';

const TabTypes = {
	upvotes: 'UPVOTES',
	downvotes: 'DOWNVOTES',
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

const mapStateToProps = state => ({
	canAccessDownvotes: determineAccessLevel(state.userProfile.accessLevel) > 2,
});

@connect(mapStateToProps)
@translate()
@observer
class Likes extends Component {
	@observable likes = new ILikes({ type: this.props.type, id: this.props.id });

	@observable activeTab = TabTypes.upvotes;

	@action handleTabChange = (val) => {
		this.activeTab = val;
	}

	render() {
		const {
			canAccessDownvotes, open, onRequestClose,
		} = this.props;
		const {
			upvotes, downvotes, getUpvotes, getDownvotes, onFollow,
		} = this.likes;
		return (
			<Dialog
				open={open}
				onRequestClose={onRequestClose}
			>
				<div style={styles.container}>
					{
						canAccessDownvotes
							? (
								<div>
									<div style={styles.header}>
										<Tabs
											style={styles.tabsWrapper}
											value={this.activeTab}
											onChange={this.handleTabChange}
											tabItemContainerStyle={styles.tabs}
										>
											<Tab
												label="Upvotes"
												value={TabTypes.upvotes}
												style={styles.tab}
											/>
											<Tab
												label="Downvotes"
												value={TabTypes.downvotes}
												style={styles.tab}
											/>
										</Tabs>
										<IconButton className="close" onClick={onRequestClose}>
											<Close color={grey600} />
										</IconButton>
									</div>
									{this.activeTab === TabTypes.upvotes &&
										<UserList
											users={upvotes.entities}
											hasMore={upvotes.hasMore}
											loadMore={getUpvotes}
											onFollowClick={onFollow}
										/>
									}
									{this.activeTab === TabTypes.downvotes &&
										<UserList
											users={downvotes.entities}
											hasMore={downvotes.hasMore}
											loadMore={getDownvotes}
											onFollowClick={onFollow}
										/>
									}
								</div>
							)
							: (
								<UserList
									users={upvotes.entities}
									hasMore={upvotes.hasMore}
									loadMore={getUpvotes}
									onFollowClick={onFollow}
								/>
							)
					}
				</div>
			</Dialog>
		);
	}
}

Likes.propTypes = {
	id: PropTypes.number.isRequired,
	type: PropTypes
		.oneOf([ 'code', 'post', 'lessonComment', 'userLessonComment', 'codeComment' ]).isRequired,
	onRequestClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

export default Likes;
