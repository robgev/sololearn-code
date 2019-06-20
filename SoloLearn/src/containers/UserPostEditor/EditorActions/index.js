import React from 'react';
import { translate } from 'react-i18next';
import { Container, PopupActions } from 'components/atoms';
import { PromiseButton, FlatButton } from 'components/molecules';

import './styles.scss';

const EditorActions = ({
	isPostButtonDisabled,
	createOrEditPostHandler,
	closePopup,
	initialUserPostId,
	t,
}) => (
	<PopupActions className="user-post-popup-actions">
		<Container className="user-post-actions-container">
			<FlatButton
				onClick={closePopup}
				className="user-post-cancel-button"
			>
				{t('common.cancel-title')}
			</FlatButton>
			<PromiseButton
				raised
				color="primary"
				disabled={isPostButtonDisabled}
				fire={createOrEditPostHandler}
				className="up-share-button"
			>
				{initialUserPostId ? t('common.save-action-title') : 'Share'}
			</PromiseButton>
		</Container>
	</PopupActions>
);

export default translate()(EditorActions);
