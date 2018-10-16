import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import AvatarEditor from 'react-cropper';
import Dialog from 'components/StyledDialog';
import { PromiseButton } from 'components/LoadingButton';
import FlatButton from 'material-ui/FlatButton';
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
				label={t('common.cancel-title')}
			/>,
			<PromiseButton
				primary
				onClick={this.onCrop}
				style={{ width: 'initial' }}
				label={t('common.confirm-title')}
			/>,
		];
		return (
			<Dialog
				open={open}
				actions={actions}
				title={t('settings.edit-photo')}
				onRequestClose={this.onRequestClose}
				className="avatar-cropper-container"
			>
				<AvatarEditor
					src={image}
					viewMode={3}
					dragMode="move"
					aspectRatio={1 / 1}
					ref={this.setEditorRef}
					minCropBoxWidth={256}
					minCropBoxHeight={256}
					toggleDragModeOnDblclick={false}
					style={{ height: 400, width: '100%' }}
				/>
			</Dialog>
		);
	}
}

export default Profile;
