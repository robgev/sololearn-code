import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Resizer from 'react-image-file-resizer';
import { withRouter, browserHistory } from 'react-router';
import { convertToRaw } from 'draft-js';
// import createEmojiPlugin from 'draft-js-emoji-plugin';

import {
	PopupTitle,
	FlexBox,
	Loading,
	Container,
	Image as AtomImage,
	IconButton,
	Snackbar,
} from 'components/atoms';
import { ProfileAvatar } from 'components/molecules';
import { Close } from 'components/icons';
import { getMentionsValue } from 'utils';

import { getUserSelector } from 'reducers/reducer_user';
import { getUserpostBackgroundsSelector } from 'reducers/userpostBackgrounds.reducer';
import { getUserpostBackgrounds } from 'actions/userpost';

import EditorActions from './EditorActions';
import DraftEditor from './DraftEditor';
import BackgroundIconButton from './BackgroundIconButton';
import UploadImageInput from './UploadImageInput';

import {
	uploadPostImage,
	createPost,
	editPost,
} from './userpost.actions';

import { getNewFeedItemsInternal } from 'actions/feed';

// import './emojiPlugin.css';
import './styles.scss';

export const USER_POST_MAX_LENGTH = 1024;

const UserPostEditor = ({
	afterPostCallback = null,
	profile,
	closePopup,
	draftEditorInitialText = '',
	initialSelectedBackgroundId = -1,
	initialImageSource = null,
	initialUserPostId = null,
	updateListItems = () => { },
	getNewFeedItemsInternal,
	openImageInput = false,
	toggleImageInput = null,
	backgrounds,
	getUserpostBackgrounds,
	t,
}) => {
	// const [ backgrounds, setBackgrounds ] = useState([]);
	const [ canApplyBackground, setCanApplyBackground ] = useState(true);
	const [ selectedBackgroundId, setSelectedBackgroundId ] = useState(initialSelectedBackgroundId);

	const imageInputRef = useRef();
	const [ imageSource, setImageSource ] = useState(initialImageSource || null);
	const [ imageData, setImageData ] = useState(null);
	const [ imageType, setImageType ] = useState('.jpg');
	const [ isPostButtonDisabled, togglePostButtonDisabled ] = useState(true);
	const [ editorText, setEditorText ] = useState('');

	const [ isSnackBarOpen, toggleSnackBarIsOpen ] = useState(false);
	const [ snackMessage, setSnackMessage ] = useState('');

	// const emojiPlugin = useRef(createEmojiPlugin({
	// 	useNativeArt: true,
	// }));
	// const { EmojiSuggestions, EmojiSelect } = emojiPlugin.current;

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
		if (backgrounds.length === 0) {
			getUserpostBackgrounds();
		}
		if (initialImageSource) {
			setImageSource(initialImageSource);
		}
		if (openImageInput) {
			setTimeout(() => {
				if (imageInputRef.current) {
					imageInputRef.current.click();
				} else {
					setTimeout(() => {
						imageInputRef.current.click();
					}, 300);
				}
			}, 300);
		}
		if (toggleImageInput) {
			return toggleImageInput();
		}
	}, []);

	// this doesn't work on late responce
	// useEffect(() => {
	// 	if (imageInputRef.current) {
	// 		if (openImageInput) {
	// 			imageInputRef.current.click();
	// 		}
	// 	}
	// }, [ imageInputRef.current ]);

	// Post button disabled toggler
	useEffect(() => {
		if ((editorText && editorText.getPlainText().trim()) || imageSource) {
			togglePostButtonDisabled(false);
		} else {
			togglePostButtonDisabled(true);
		}
	}, [ editorText, imageSource ]);

	const onImageLoad = (e, uri) => {
		if (e.target.width < 100 || e.target.height < 50) {
			setSnackMessage('The Image is too small');
			toggleSnackBarIsOpen(true);
		} else if (e.target.width > 2048 || e.target.height > 2048 || e.target.width * 4 < e.target.height) {
			setSnackMessage('The Image is too big');
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

	const onImageSelect = async (e) => {
		if (e.target.files[0] && e.target.files[0].type !== 'image/gif') {
			Resizer.imageFileResizer(
				e.target.files[0], // is the file of the new image that can now be uploaded...
				1200, // is the maxWidth of the  new image
				1200, // is the maxHeight of the  new image
				'JPEG', // is the compressFormat of the  new image
				90, // is the quality of the  new image
				0, // is the rotation of the  new image
				(uri) => {
					const img = new Image();
					img.src = uri;
					img.onload = e => onImageLoad(e, uri);
					setImageType('.jpg');
				}, // is the callBack function of the new image URI
				'base64', // is the output type of the new image
			);
		} else if (e.target.files[0] && e.target.files[0].type === 'image/gif') {
			const gifImageSource = window.URL.createObjectURL(e.target.files[0]);
			setImageSource(gifImageSource);
			const gif = new Image();
			gif.src = gifImageSource;
			gif.onload = e => onImageLoad(e, gifImageSource);
			setImageType('.gif');
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
			getNewFeedItemsInternal()
				.then(() => browserHistory.push('/feed'));
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
		})
		.then(() => updateListItems());

	const createPostHandler = () => {
		togglePostButtonDisabled(true);
		const text = getMentionsValue(convertToRaw(editorText));
		if (imageSource) {
			return uploadPostImage(imageData, `postimage${imageType}`)
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
		togglePostButtonDisabled(true);
		const text = getMentionsValue(convertToRaw(editorText));
		if (imageData) {
			return uploadPostImage(imageData, `postimage${imageType}`)
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
			<Container className="user-post-main-container">
				{!toggleImageInput &&
					<FlexBox justifyBetween align>
						<PopupTitle className="user-post-main-title">
							{`${(draftEditorInitialText && initialUserPostId) || (initialImageSource && initialUserPostId) ? t('user_post.edit-post-title') : t('user_post.new-post-title')}`}
						</PopupTitle>
						<IconButton onClick={closePopup}>
							<Close />
						</IconButton>
					</FlexBox>
				}
				<Container className="user-post-main-content">
					{backgrounds && backgrounds.length ?
						<FlexBox className="up-inner-container">
							<ProfileAvatar
								user={profile}
								className="up-editor-profile-avatar"
							/>
							<FlexBox column className="up-editor-draft-wrapper">
								<DraftEditor
									background={background}
									setEditorText={setEditorText}
									editorInitialText={draftEditorInitialText}
									onEscape={closePopup}
								// emojiPlugin={emojiPlugin}
								/>

								{imageSource &&
									<FlexBox justify align >
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
								}
								{
									canApplyBackground
										? (
											<FlexBox justify align className="backgrounds-container backgrounds-container-separate">
												{
													backgrounds.map(el =>
														(<BackgroundIconButton
															onSelect={setSelectedBackgroundId}
															background={el}
															withBorder={el.id === -1}
														/>))
												}
											</FlexBox>
										)
										: null
								}
								<FlexBox
									align
									justifyBetween
									className="up-editor-actions-container"
								>
									<AtomImage
										onClick={() => imageInputRef.current.click()}
										src="/assets/image_icon_2x.png"
										className="add-image-icon"
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
																withBorder={el.id === -1}
															/>))
													}
												</FlexBox>
											)
											: null
									}
									<EditorActions
										isPostButtonDisabled={isPostButtonDisabled}
										createOrEditPostHandler={initialUserPostId ? editPostHandler : createPostHandler}
										closePopup={closePopup}
										initialUserPostId={initialUserPostId}
									/>
								</FlexBox>
							</FlexBox>

						</FlexBox>
						:
						<FlexBox fullWith justify align className="up-loader-container">
							<Loading />
						</FlexBox>
					}
				</Container>
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
		</Container>
	);
};

const mapStateToProps = state => ({
	profile: getUserSelector(state),
	backgrounds: getUserpostBackgroundsSelector(state),
});

export default translate()(connect(mapStateToProps, { getNewFeedItemsInternal, getUserpostBackgrounds })(withRouter(UserPostEditor)));
