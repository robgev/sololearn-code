import React, { useState, useEffect, useRef } from 'react';
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

import Storage from 'api/storage';

import DraftEditor from './DraftEditor';
import EditorActions from './EditorActions';

import BackgroundIconButton from './BackgroundIconButton';
import UploadImageInput from './UploadImageInput';

import { getPostBackgrounds } from './userpost.actions';

import './styles.scss';

const UserPostEditor = ({ params }) => {
	const [ backgrounds, setBackgrounds ] = useState([]);
	const [ textInfo, setTextInfo ] = useState({ length: 0, newLinesCount: 0 });
	const [ canApplyBackground, setCanApplyBackground ] = useState(true);
	const [ selectedBackgroundId, setSelectedBackgroundId ] = useState(-1);
	const imageInputRef = useRef();
	const [ imageSource, setImageSource ] = useState(null);

	const computeCanApplyBackground = () => {
		if (textInfo.length > 200
			|| textInfo.newLinesCount > 4
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

	const onImageSelect = (e) => {
		setImageSource(window.URL.createObjectURL(e.target.files[0]));
	};

	const removeImage = () => {
		setImageSource(null);
	};

	useEffect(() => {
		computeCanApplyBackground();
	}, [ textInfo, imageSource ]);

	const backgroundId = canApplyBackground ? selectedBackgroundId : -1;

	const background = backgrounds.find(b => b.id === backgroundId);

	const profile = Storage.load('profile');
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
							setTextInfo={setTextInfo}
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
								!imageSource
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
						<EditorActions />
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

export default withRouter(UserPostEditor);
