import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Service from 'api/service';
import { deletePostInternal } from 'actions/discuss';

@translate()
class RemovalPopup extends PureComponent {
	requestRemoval = async () => {
		const {
			post,
			itemType,
			accessLevel,
			onRequestClose,
			removedItemId,
			onSubmitFinished,
		} = this.props;
		try {
			if (accessLevel > 1) {
				deletePostInternal(post);
				if (post.parentID === null) {
					browserHistory.push('/discuss/');
				}
			} else {
				Service.request('ReportItem', {
					itemType,
					reason: 100, // Server reason for moderator prompt.
					itemId: removedItemId,
				});
			}
			if (typeof onSubmitFinished === 'function') {
				onSubmitFinished();
			}
			onRequestClose();
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const {
			accessLevel, onRequestClose, open, t,
		} = this.props;
		const actions = [
			<FlatButton
				primary
				onClick={onRequestClose}
				label={t('common.cancel-title')}
			/>,
			<FlatButton
				primary
				onClick={() => this.requestRemoval()}
				label={accessLevel === 1 ?
					t('common.confirm-title') :
					t('common.remove-title')
				}
			/>,
		];
		return (
			<Dialog
				open={open}
				actions={actions}
				onRequestClose={onRequestClose}
				title={accessLevel === 1 ?
					t('discuss.forum_request_removal_prompt_title') :
					t('discuss.forum_remove_prompt_title')
				}
			>
				{accessLevel === 1 ?
					t('discuss.forum_request_removal_prompt_text') :
					t('discuss.forum_remove_prompt_text')
				}
			</Dialog>
		);
	}
}

export default RemovalPopup;
