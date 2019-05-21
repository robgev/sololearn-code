import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import { withRouter, browserHistory } from 'react-router';
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
import ProfileAvatar from 'components/ProfileAvatar';
import { AddPhotoAlternate, Close } from 'components/icons';
import { getMentionsValue } from 'utils';

import { getUserSelector } from 'reducers/reducer_user';

import EditorActions from './EditorActions';
import DraftEditor from './DraftEditor';
import BackgroundIconButton from './BackgroundIconButton';
import UploadImageInput from './UploadImageInput';

import {
	getPostBackgrounds,
	uploadPostImage,
	createPost,
	editPost,
} from './userpost.actions';

import './styles.scss';

export const USER_POST_MAX_LENGTH = 1024;

const UserPostEditor = ({
	params,
	afterPostCallback = null,
	profile,
	closePopup,
	draftEditorInitialText = '',
	initialSelectedBackgroundId = -1,
	initialImageSource = null,
	initialUserPostId = null,
}) => {
	const [ backgrounds, setBackgrounds ] = useState([]);
	const [ canApplyBackground, setCanApplyBackground ] = useState(true);
	const [ selectedBackgroundId, setSelectedBackgroundId ] = useState(initialSelectedBackgroundId);

	const imageInputRef = useRef();
	const [ imageSource, setImageSource ] = useState(initialImageSource || null);
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
		if (initialImageSource) {
			setImageSource(initialImageSource);
		}
	}, []);

	// Post button disabled toggler
	useEffect(() => {
		if ((editorText && editorText.getPlainText().trim()) || imageSource) {
			togglePostButtonDisabled(false);
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
					const img = new Image();
					img.src = uri;
					img.onload = () => {
						if (img.width < 100 || img.height < 50) {
							setSnackMessage('The Image is too small');
							toggleSnackBarIsOpen(true);
						} else {
							setImageSource(uri);
							fetch(uri)
								.then(data => data.blob())
								.then((dataBlob) => {
									setImageData(dataBlob);
								});
						}
					};
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

	// Calback after post create-edit-repost
	const afterPostHandler = (post) => {
		closePopup();
		if (afterPostCallback) {
			afterPostCallback({ ...post, background });
		} else {
			browserHistory.push('feed');
		}
	};

	// Create Post Handlers
	const createRequestHandler = ({ backgroundId, imageUrl, message }) => createPost({
		message,
		backgroundId,
		imageUrl,
	})
		.then((res) => {
			if (res) {
				afterPostHandler(res.post);
			}
		});

	const createPostHandler = () => {
		const text = getMentionsValue(convertToRaw(editorText));
		if (imageSource) {
			return uploadPostImage(imageData, 'postimage.jpg')
				.then(res => createRequestHandler({
					message: text,
					backgroundId: null,
					imageUrl: res.imageUrl,
				}));
		}
		return createRequestHandler({
			message: text,
			backgroundId: canApplyBackground && selectedBackgroundId !== -1 ? selectedBackgroundId : null,
			imageUrl: null,
		});
	};

	// Edit Post handlers
	const editRequestHandler = ({ backgroundId, imageUrl, message }) => editPost({
		id: initialUserPostId,
		message,
		backgroundId,
		imageUrl,
	})
		.then((res) => {
			if (res) {
				afterPostHandler(res.post);
			}
		});

	const editPostHandler = () => {
		const text = getMentionsValue(convertToRaw(editorText));
		if (imageData) {
			return uploadPostImage(imageData, 'postimage.jpg')
				.then(res => editRequestHandler({
					backgroundId: null,
					imageUrl: res.imageUrl,
					message: text,
				}));
		}
		return editRequestHandler({
			backgroundId: canApplyBackground && selectedBackgroundId !== -1 ? selectedBackgroundId : null,
			imageUrl: initialImageSource && imageSource ? initialImageSource : '',
			message: text,
		});
	};

	return (
		<Container>
			{backgrounds && backgrounds.length ?
				<PaperContainer className="user-post-main-container">
					<FlexBox column fullWith>
						<FlexBox justifyBetween align>
							<Title className="user-post-main-title">{`${params.id ? 'Edit post' : 'New Post'}`}</Title>
							<IconButton onClick={() => closePopup()}>
								<Close />
							</IconButton>
						</FlexBox>
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
							editorInitialText={draftEditorInitialText}
						/>
						<FlexBox justifyEnd className="user-post-max-length-container">
							<SecondaryTextBlock className="count">
								{editorText ? editorText.getPlainText().length : 0} / {USER_POST_MAX_LENGTH}
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
							createOrEditPostHandler={initialUserPostId ? editPostHandler : createPostHandler}
							closePopup={closePopup}
							initialUserPostId={initialUserPostId}
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
		</Container>
	);
};

const mapStateToProps = state => ({
	profile: getUserSelector(state),
});

export default connect(mapStateToProps)(withRouter(UserPostEditor));
