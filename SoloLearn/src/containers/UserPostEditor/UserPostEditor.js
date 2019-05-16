import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import { getUserSelector } from 'reducers/reducer_user';
import { withRouter } from 'react-router';
import { convertToRaw } from 'draft-js';
import {
	Title,
	PaperContainer,
	FlexBox,
	Chip,
	Loading,
	Container,
	Image as AtomImage,
	IconButton,
	SecondaryTextBlock,
	Snackbar,
} from 'components/atoms';
import { SuccessPopup } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';
import { AddPhotoAlternate, Close } from 'components/icons';
import { getMentionsValue } from 'utils';

import EditorActions from './EditorActions';
import DraftEditor from './DraftEditor';

import BackgroundIconButton from './BackgroundIconButton';
import UploadImageInput from './UploadImageInput';

import { getPostBackgrounds, uploadPostImage, createPost } from './userpost.actions';

import './styles.scss';

export const USER_POST_MAX_LENGTH = 1024;

const UserPostEditor = ({ params, profile, closePopup }) => {
	const [ backgrounds, setBackgrounds ] = useState([]);
	const [ canApplyBackground, setCanApplyBackground ] = useState(true);
	const [ selectedBackgroundId, setSelectedBackgroundId ] = useState(-1);
	const [ isSuccessPopupOpen, toggleSuccessPopupIsOpen ] = useState(false);

	const imageInputRef = useRef();
	const [ imageSource, setImageSource ] = useState(null);
	const [ imageData, setImageData ] = useState(null);
	const [ isPostButtonDisabled, togglePostButtonDisabled ] = useState(true);
	const [ editorText, setEditorText ] = useState('');

	const [ isSnackBarOpen, toggleSnackBarIsOpen ] = useState(false);
	const [ snackMessage, setSnackMessage ] = useState('');

	const computeCanApplyBackground = () => {
		if (editorText) {
			const text = editorText.getPlainText();
			const newLinesCount = (text.match(/\n/g) || []).length;
			if (text.length > 200
				|| newLinesCount > 4
				|| imageSource !== null) {
				setCanApplyBackground(false);
			} else {
				setCanApplyBackground(true);
			}
		}
	};

	useEffect(() => {
		getPostBackgrounds()
			.then((res) => {
				setBackgrounds([ { type: 'none', id: -1 }, ...res.backgrounds ]);
			});
	}, []);

	// Post button disabled toggler
	useEffect(() => {
		if (editorText || imageSource) {
			if (editorText.getPlainText().trim() || imageSource) {
				togglePostButtonDisabled(false);
			}
		} else {
			togglePostButtonDisabled(true);
		}
	}, [ editorText, imageSource ]);

	const onImageSelect = async (e) => {
		if (e.target.files[0]) {
			Resizer.imageFileResizer(
				e.target.files[0], // is the file of the new image that can now be uploaded...
				1200, // is the maxWidth of the  new image
				1200, // is the maxHeight of the  new image
				'JPEG', // is the compressFormat of the  new image
				90, // is the quality of the  new image
				0, // is the rotatoion of the  new image
				(uri) => {
					setImageSource(uri);
					fetch(uri)
						.then(data => data.blob())
						.then((dataBlob) => {
							setImageData(dataBlob);
						});
				}, // is the callBack function of the new image URI
				'base64', // is the output type of the new image
			);
		}
	};

	const removeImage = () => {
		setImageSource(null);
		setImageData(null);
	};

	useEffect(() => {
		computeCanApplyBackground();
	}, [ editorText, imageSource ]);

	const backgroundId = canApplyBackground ? selectedBackgroundId : -1;

	const background = backgrounds.find(b => b.id === backgroundId);

	const createNewPostHandler = () => {
		const text = getMentionsValue(convertToRaw(editorText));
		if (imageSource) {
			uploadPostImage(imageData, 'postimage.jpg')
				.then(res => createPost({
					message: editorText,
					backgroundId: null,
					imageUrl: res.imageUrl,
				})
					.then((res) => {
						if (res) {
							toggleSuccessPopupIsOpen(true);
						}
					}));
		}
		return createPost({
			message: text,
			backgroundId: canApplyBackground && selectedBackgroundId !== -1 ? selectedBackgroundId : null,
			imageUrl: null,
		})
			.then((res) => {
				if (res) {
					toggleSuccessPopupIsOpen(true);
				}
			});
	};

	return (
		<Container>
			{backgrounds && backgrounds.length ?
				<PaperContainer className="user-post-main-container">
					<FlexBox column fullWith>
						<Title className="user-post-main-title">{`${params.id ? 'Edit post' : 'New Post'}`}</Title>

						<ProfileAvatar
							userID={profile.id}
							avatarUrl={profile.avatarUrl}
							badge={profile.badge}
							userName={profile.name}
							withUserNameBox
							withBorder
							className="profile-avatar-container"
						/>
						<DraftEditor
							background={background}
							setEditorText={setEditorText}
						/>
						<FlexBox justifyEnd className="user-post-max-length-container">
							<SecondaryTextBlock className="count">
								{editorText.length} / {USER_POST_MAX_LENGTH}
							</SecondaryTextBlock>
						</FlexBox>
						<FlexBox justify align>
							<Container className="user-post-image-preview-container">
								<IconButton
									onClick={() => {
										imageInputRef.current.value = '';
										removeImage();
									}}
									className="image-preview-remove-icon"
									style={{ display: imageSource ? 'block' : 'none' }}
								>
									<Close />
								</IconButton>
								<AtomImage src={imageSource || ''} className="user-post-image-preview" />
							</Container>
						</FlexBox>

						<FlexBox align justify className="add-image-and-backgrounds-container">
							<Chip
								icon={<AddPhotoAlternate className="add-image-icon" />}
								label={imageSource ? 'Change Image' : 'Add Image'}
								className="add-image-chip"
								onClick={() => imageInputRef.current.click()}
							/>
							<UploadImageInput inputRef={imageInputRef} handleChange={onImageSelect} />
							{
								canApplyBackground
									? (
										<FlexBox className="backgrounds-container">
											{
												backgrounds.map(el =>
													(<BackgroundIconButton
														onSelect={setSelectedBackgroundId}
														background={el}
													/>))
											}
										</FlexBox>
									)
									: null
							}
						</FlexBox>

						<EditorActions
							isPostButtonDisabled={isPostButtonDisabled}
							createNewPostHandler={createNewPostHandler}
							closePopup={closePopup}
						/>

					</FlexBox>
				</PaperContainer>
				:
				<PaperContainer className="user-post-loader-container">
					<Loading />
				</PaperContainer>
			}
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				open={isSnackBarOpen}
				autoHideDuration={5000}
				onClose={() => toggleSnackBarIsOpen(false)}
				message={snackMessage}
			/>
			<SuccessPopup open={isSuccessPopupOpen} onClose={() => { toggleSuccessPopupIsOpen(false); closePopup(); }} text="Post Created" />
		</Container>
	);
};

const mapStateToProps = state => ({
	profile: getUserSelector(state),
});

export default connect(mapStateToProps)(withRouter(UserPostEditor));
