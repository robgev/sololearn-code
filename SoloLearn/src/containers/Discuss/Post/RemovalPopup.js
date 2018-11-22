import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { Popup, PopupTitle, PopupContent, PopupActions } from 'components/atoms';
import { FlatButton } from 'components/molecules';
import Service from 'api/service';
import { determineAccessLevel } from 'utils';

const mapStateToProps = state => ({
	canDelete: determineAccessLevel(state.userProfile.accessLevel) >= 2,
});

@connect(mapStateToProps)
@translate()
class RemovalPopup extends PureComponent {
	requestRemoval = () => {
		const {
			isReply,
			id,
			canDelete,
			deletePost,
			onClose,
		} = this.props;
		try {
			onClose();
			if (canDelete) {
				deletePost();
				if (!isReply) {
					browserHistory.push('/discuss/');
				}
			} else {
				Service.request('ReportItem', {
					itemType: 'post',
					reason: 100, // Server reason for moderator prompt.
					itemId: id,
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const {
			canDelete, onClose, open, t,
		} = this.props;
		return (
			<Popup
				open={open}
				onClose={onClose}
			>
				<PopupTitle>
					{
						canDelete
							? t('discuss.forum_remove_prompt_title')
							: t('discuss.forum_request_removal_prompt_title')
					}
				</PopupTitle>
				<PopupContent>
					{
						canDelete
							? t('discuss.forum_remove_prompt_text')
							: t('discuss.forum_request_removal_prompt_text')
					}
				</PopupContent>
				<PopupActions>
					<FlatButton
						color="primary"
						onClick={onClose}
					>
						{t('common.cancel-title')}
					</FlatButton>
					<FlatButton
						color="primary"
						onClick={() => this.requestRemoval()}
					>
						{
							canDelete
								? t('common.remove-title')
								: t('common.confirm-title')
						}
					</FlatButton>
				</PopupActions>
			</Popup>
		);
	}
}

RemovalPopup.defaultProps = {
	isReply: false,
};

RemovalPopup.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	// If canDelete, then mod high enough that he can delete the post without requesting deletion
	canDelete: PropTypes.bool.isRequired,
	isReply: PropTypes.bool,
	id: PropTypes.number.isRequired,
	deletePost: PropTypes.func.isRequired,
};

export default RemovalPopup;
