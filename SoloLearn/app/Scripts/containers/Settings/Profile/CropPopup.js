import React, { PureComponent } from 'react';
import AvatarEditor from 'react-cropper';
import Dialog from 'material-ui/Dialog';
import 'cropperjs/dist/cropper.css';
import 'styles/Settings/Profile/CropPopup.scss';

class Profile extends PureComponent {
	setEditorRef = (editor) => {
		if (editor) this.editor = editor;
	}

	handleScroll = (e) => {
		console.log(e);
	}

	render() {
		const { open, image, onRequestClose } = this.props;
		return (
			<Dialog
				open={open}
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
					toggleDragModeOnDblclick={false}
					style={{ height: 400, width: '100%' }}
				/>
			</Dialog>
		);
	}
}

export default Profile;
