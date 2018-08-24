import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'components/StyledDialog';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';
import UserList from 'containers/Profile/UserList';
import { determineAccessLevel, numberFormatter } from 'utils';
import ILikes from './ILikes';

import './likes.scss';

const TabTypes = {
	upvotes: 'UPVOTES',
	downvotes: 'DOWNVOTES',
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

	@observable open = false;

	@action toggleOpen = () => {
		this.open = !this.open;
		if (!this.open) {
			this.likes.empty();
		}
	}

	@action handleTabChange = (val) => {
		this.activeTab = val;
	}

	render() {
		const {
			votes,
			hasPlus,
			className,
			canAccessDownvotes,
		} = this.props;
		const {
			upvotes, downvotes, getUpvotes, getDownvotes, onFollow,
		} = this.likes;
		return (
			<div
				onClick={this.toggleOpen}
				onKeyPress={this.handleKeyPress}
				role="button"
				tabIndex={0}
				className={`likes-container ${className}`}
			>
				{(votes > 0 && hasPlus) && '+'}{numberFormatter(votes)}
				<Dialog
					open={this.open}
					onRequestClose={this.toggleOpen}
				>
					<div style={{
						position: 'relative',
						height: 500,
						overflowY: 'auto',
					}}
					>
						{
							canAccessDownvotes
								? (
									<div>
										<div style={{ display: 'flex' }}>
											<Tabs
												style={{ flex: 1 }}
												value={this.activeTab}
												onChange={this.handleTabChange}
												tabItemContainerStyle={{ backgroundColor: '#fff' }}
											>
												<Tab
													label="Upvotes"
													value={TabTypes.upvotes}
													style={{ color: 'rgba(107, 104, 104, 0.8)' }}
												/>
												<Tab
													label="Downvotes"
													value={TabTypes.downvotes}
													style={{ color: 'rgba(107, 104, 104, 0.8)' }}
												/>
											</Tabs>
											<IconButton className="close" onClick={this.toggleOpen}>
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
			</div>
		);
	}
}

Likes.defaultProps = {
	className: '',
	hasPlus: true,
};

Likes.propTypes = {
	id: PropTypes.number.isRequired,
	type: PropTypes
		.oneOf([ 'code', 'post', 'lessonComment', 'userLessonComment', 'codeComment' ]).isRequired,
	votes: PropTypes.number.isRequired,
	hasPlus: PropTypes.bool,
	className: PropTypes.string,
};

export default Likes;
