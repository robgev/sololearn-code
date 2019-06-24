import React, { useState, useRef } from 'react';
import { translate } from 'react-i18next';
import {
	Container,
	PaperContainer,
	FlexBox,
	Input,
	Image,
	ClickAwayListener,
} from 'components/atoms';
import {
	ProfileAvatar,
} from 'components/molecules';

import UserPostEditor from 'containers/UserPostEditor';

import 'styles/Feed/FeedHeader.scss';

const FeedHeader = ({ profile, t, afterPostCallback }) => {
	const [ isCreatePostOpen, toggleCreatePost ] = useState(false);
	const [ openImageInput, toggleImageInput ] = useState(false);
	// this is for random hint selection in the input form like mobile ->
	const userPostHintsArray = [
		'user_post.hints.user-post-form-hint-1',
		'user_post.hints.user-post-form-hint-2',
		'user_post.hints.user-post-form-hint-3',
	];
	const randomHint = useRef(userPostHintsArray[
		Math.floor(Math.random() * userPostHintsArray.length)
	]);

	const inputClickHandler = (e) => {
		e.target.blur();
		toggleCreatePost(true);
	};

	const clickImageHandler = () => {
		toggleImageInput(true);
		toggleCreatePost(true);
	};

	return (
		<Container className="feed-header-main-container">
			{!isCreatePostOpen ?
				(
					<PaperContainer className="feed-header">
						<FlexBox className="actions" align fullWidth>
							<ProfileAvatar
								user={profile}
								className="up-fh-profile-avatar-container"
							/>
							<Input
								variant="outlined"
								fullWidth
								value={`${t(randomHint.current)} ${profile.name}`}
								className="user-post-hints-input-container"
								onClick={inputClickHandler}
								inputProps={{ className: 'user-post-hints-input' }}
							/>
							<Image
								onClick={clickImageHandler}
								src="assets/image_icon_2x.png"
								className="user-post-feed-header-image"
							/>
						</FlexBox>
					</PaperContainer>
				)
				:
				(
					<React.Fragment>
						<Container className="up-feed-blur" />
						<ClickAwayListener onClickAway={() => toggleCreatePost(false)}>
							<PaperContainer className="up-wrapper-in-feed-header">
								<UserPostEditor
									closePopup={() => toggleCreatePost(false)}
									afterPostCallback={afterPostCallback}
									openImageInput={openImageInput}
									toggleImageInput={() => toggleImageInput(false)}
								/>
							</PaperContainer>
						</ClickAwayListener>
					</React.Fragment>
				)
			}
		</Container>
	);
};

export default translate()(FeedHeader);
