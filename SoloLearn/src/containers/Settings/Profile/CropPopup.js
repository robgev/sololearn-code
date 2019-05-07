import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import AvatarEditor from 'react-cropper';
import { PromiseButton } from 'components/LoadingButton';
import { FlatButton } from 'components/molecules';
import {
	Popup,
	PopupActions,
	PopupContent,
	PopupTitle,
} from 'components/atoms';
import { updateAvatar } from 'actions/settings';

import 'cropperjs/dist/cropper.css';
import 'styles/Settings/Profile/CropPopup.scss';

@connect(null, { updateAvatar })
class Profile extends PureComponent {
	setEditorRef = (editor) => {
		if (editor) this.editor = editor;
	}

	onCrop = async () => {
		const dataUrl = this.editor.getCroppedCanvas().toDataURL();
		const data = await fetch(dataUrl);
		const blob = await data.blob();
		const avatarUrl = await this.props.updateAvatar(blob);
		console.warn(avatarUrl);
		this.props.onRequestClose(avatarUrl);
	}

	onRequestClose = () => {
		this.props.onRequestClose();
	}

	render() {
		const {
			t,
			open,
			image,
		} = this.props;
		const actions = [
			<FlatButton
				primary
				onClick={this.onRequestClose}
			>
				{t('common.cancel-title')}
			</FlatButton>,
			<PromiseButton
				primary
				onClick={this.onCrop}
				style={{ width: 'initial' }}
				label={t('common.confirm-title')}
			/>,
		];
		return (
			<Popup
				open={open}
				onClose={this.onRequestClose}
				classes={{ paper: 'crop-dialog' }}
			>
				<PopupTitle>
					{t('settings.edit-photo')}
				</PopupTitle>
				<PopupContent>
					<AvatarEditor
						src={image}
						viewMode={3}
						dragMode="move"
						aspectRatio={1 / 1}
						ref={this.setEditorRef}
						minCropBoxWidth={256}
						minCropBoxHeight={256}
						toggleDragModeOnDblclick={false}
						style={{ width: '100%' }}
					/>
				</PopupContent>
				<PopupActions>
					{actions}
				</PopupActions>
			</Popup>
		);
	}
}

export default Profile;
