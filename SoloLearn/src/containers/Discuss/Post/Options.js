import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Menu, MenuItem } from 'components/atoms';
import { IconMenu } from 'components/molecules';
import { determineAccessLevel } from 'utils';

const mapStateToProps = (state, ownProps) => ({
	canRequestRemoval: determineAccessLevel(state.userProfile.accessLevel) === 1,
	canRemove: determineAccessLevel(state.userProfile.accessLevel) > 1,
	canEdit: determineAccessLevel(state.userProfile.accessLevel) > 1,
	isMe: state.userProfile.id === ownProps.userID,
});

@translate()
@connect(mapStateToProps)
class Options extends Component {
	render() {
		const {
			isMe, canRequestRemoval, canEdit, canRemove, t,
			editPost, deletePost, reportPost, requestRemoval,
		} = this.props;
		return (
			<Fragment>
				<IconMenu>
					{isMe || canEdit
						? (
							<MenuItem
								onClick={editPost}
							>
								{t('common.edit-action-title')}
							</MenuItem>
						)
						: null
					}
					{isMe || canRemove
						? (
							<MenuItem
								onClick={deletePost}
							>
								{t('common.delete-title')}
							</MenuItem>
						)
						: null
					}
					{!isMe
						? (
							<MenuItem
								onClick={reportPost}
							>
								{t('common.report-action-title')}
							</MenuItem>
						)
						: null
					}
					{!isMe && canRequestRemoval
						? (
							<MenuItem
								onClick={requestRemoval}
							>
								{t('discuss.forum_request_removal_prompt_title') }
							</MenuItem>
						)
						: null
					}
				</IconMenu>
			</Fragment>
		);
	}
}

export default Options;
