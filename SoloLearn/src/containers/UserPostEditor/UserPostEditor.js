import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { getUserSelector } from 'reducers/reducer_user';
import { withRouter } from 'react-router';
import {
	Title,
	PaperContainer,
	FlexBox,
	Chip,
	Loading,
	Container,
	Image,
	IconButton,
} from 'components/atoms';
import { Layout } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';
import { AddPhotoAlternate, Close } from 'components/icons';

import EditorActions from './EditorActions';
import DraftEditor from './DraftEditor';

import BackgroundIconButton from './BackgroundIconButton';
import UploadImageInput from './UploadImageInput';

import { getPostBackgrounds, uploadPostImage, createPost } from './userpost.actions';

import './styles.scss';

const UserPostEditor = ({ params, profile }) => {
	const [ backgrounds, setBackgrounds ] = useState([]);
	const [ canApplyBackground, setCanApplyBackground ] = useState(true);
	const [ selectedBackgroundId, setSelectedBackgroundId ] = useState(-1);

	const imageInputRef = useRef();
	const [ imageSource, setImageSource ] = useState(null);
	const [ imageData, setImageData ] = useState(null);
	const [ isPostButtonDisabled, togglePostButtonDisabled ] = useState(true);
	const [ editorText, setEditorText ] = useState('');

	const computeCanApplyBackground = () => {
		const newLinesCount = (editorText.match(/\n/g) || []).length;
		if (editorText.length > 200
			|| newLinesCount > 4
			|| imageSource !== null) {
			setCanApplyBackground(false);
		} else {
			setCanApplyBackground(true);
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
			togglePostButtonDisabled(false);
		} else {
			togglePostButtonDisabled(true);
		}
	}, [ editorText, imageSource ]);

	const onImageSelect = async (e) => {
		const newImageSource = window.URL.createObjectURL(e.target.files[0]);
		setImageSource(newImageSource);
		const data = await fetch(newImageSource);
		const dataBlob = await data.blob();
		setImageData(dataBlob);
	};

	const removeImage = () => {
		setImageSource(null);
	};

	useEffect(() => {
		computeCanApplyBackground();
	}, [ editorText, imageSource ]);

	const backgroundId = canApplyBackground ? selectedBackgroundId : -1;

	const background = backgrounds.find(b => b.id === backgroundId);

	const createNewPostHandler = () => {
		if (imageSource) {
			return uploadPostImage(imageData, 'postimage.jpg')
				.then((res) => {
					createPost({
						message: editorText,
						imageUrl: res.imageUrl,
						backgroundId: null,
					});
				});
		}
		return createPost({
			message: editorText,
			imageUrl: null,
			backgroundId: canApplyBackground && selectedBackgroundId !== -1 ? selectedBackgroundId : null,
		});
	};

	return (
		<Layout>
			{backgrounds && backgrounds.length ?
				<PaperContainer className="user-post-main-container">
					<FlexBox column fullWith>
						<Title className="user-post-main-title">{`${params.id ? 'Edit post' : 'New Post'}`}</Title>

						<ProfileAvatar
							userId={profile.id}
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
								<Image src={imageSource || ''} className="user-post-image-preview" />
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
						/>

					</FlexBox>
				</PaperContainer>
				:
				<FlexBox fullWith>
					<Loading />
				</FlexBox>
			}
		</Layout>
	);
};

const mapStateToProps = state => ({
	profile: getUserSelector(state),
});

export default connect(mapStateToProps)(withRouter(UserPostEditor));
