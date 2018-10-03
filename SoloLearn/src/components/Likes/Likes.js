import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'components/StyledDialog';
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
			t,
			votes,
			hasPlus,
			className,
			canAccessDownvotes,
		} = this.props;
		const {
			upvotes, downvotes, getUpvotes, getDownvotes, onFollow,
		} = this.likes;
		return (
			<Fragment>
				<div
					onClick={this.toggleOpen}
					onKeyPress={this.handleKeyPress}
					role="button"
					tabIndex={0}
					className={`likes-container ${className}`}
				>
					{(votes > 0 && hasPlus) && '+'}{numberFormatter(votes)}
				</div>
				<Dialog
					open={this.open}
					header={
						<div style={{ display: 'flex' }}>
							<Tabs
								style={{ flex: 1 }}
								onChange={this.handleTabChange}
								inkBarContainerStyle={!canAccessDownvotes ? { display: 'none' } : null}
								tabItemContainerStyle={{ marginRight: 50, backgroundColor: '#fff' }}
								value={canAccessDownvotes ? this.activeTab : TabTypes.upvotes}
							>
								<Tab
									label={t('upvotes.title')}
									value={TabTypes.upvotes}
									style={{ color: 'rgba(107, 104, 104, 0.8)' }}
								/>
								{ canAccessDownvotes &&
								<Tab
									label={t('downvotes.title')}
									value={TabTypes.downvotes}
									style={{ color: 'rgba(107, 104, 104, 0.8)' }}
								/>
								}
							</Tabs>
						</div>
					}
					onRequestClose={this.toggleOpen}
				>
					<div style={{
						height: 500,
						position: 'relative',
						overflowY: 'auto',
					}}
					>
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
				</Dialog>
			</Fragment>
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
