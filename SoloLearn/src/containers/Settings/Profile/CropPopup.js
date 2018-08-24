import React, { PureComponent } from 'react';
import AvatarEditor from 'react-cropper';
import Dialog from 'components/StyledDialog';
import FlatButton from 'material-ui/FlatButton';

import Service from 'api/service';

import 'cropperjs/dist/cropper.css';
import 'styles/Settings/Profile/CropPopup.scss';

class Profile extends PureComponent {
	setEditorRef = (editor) => {
		if (editor) this.editor = editor;
	}

	onCrop = async () => {
		const dataUrl = this.editor.getCroppedCanvas().toDataURL();
		const data = await fetch(dataUrl);
		const blob = await data.blob();
		Service.fileRequest('UpdateAvatar', blob);
		this.props.onRequestClose(blob);
	}

	render() {
		const {
			t,
			open,
			image,
			onRequestClose,
		} = this.props;
		const actions = [
			<FlatButton
				primary
				onClick={onRequestClose}
				label={t('common.cancel-title')}
			/>,
			<FlatButton
				primary
				onClick={this.onCrop}
				label={t('common.confirm-title')}
			/>,
		];
		return (
			<Dialog
				open={open}
				actions={actions}
				title="Edit the image"
				onRequestClose={onRequestClose}
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
