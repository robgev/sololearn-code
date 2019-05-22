import React, { useEffect, useState, useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {
	Container,
	FlexBox,
	TextBlock,
	Image as ImageAtom,
} from 'components/atoms';
import {
	ContainerLink,
	ModBadge,
	ProfileAvatar,
	UsernameLink,
} from 'components/molecules';
import { FeedBottomBarFullStatistics } from 'components/organisms';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import Service from 'api/service';

import './styles.scss';

const sendImpressionByPostId = id =>
	Service.request(`Profile/AddPostImpression?id=${id}`);

const UserPost = ({
	user,
	background,
	message,
	imageUrl,
	type,
	date,
	id,
	vote,
	votes,
	measure = null,
	userPostId,
	comments,
	views,
}) => {
	const impressionTimeoutIdRef = useRef();
	const [ imageShouldWrap, setImageShouldWrap ] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = imageUrl;
		img.onload = () => {
			console.log('image height', img.height);
			if (img.height > window.innerHeight * 0.5) {
				setImageShouldWrap(true);
			}
		};
	}, []);

	const cancelImpressionTimer = () => {
		if (impressionTimeoutIdRef.current) {
			clearTimeout(impressionTimeoutIdRef.current);
		}
	};

	const startImpressionTimer = () => {
		cancelImpressionTimer();
		impressionTimeoutIdRef.current = setTimeout(() => {
			sendImpressionByPostId(id);
		}, 1500);
	};

	const onVisibilityChange = (isVisible) => {
		if (isVisible) {
			startImpressionTimer();
		} else {
			cancelImpressionTimer();
		}
	};

	return (
		<VisibilitySensor onChange={onVisibilityChange}>
			<FlexBox column className="user-post-feed-item-container">
				<FlexBox align className="user-post-feed-item-profile-container">
					<ProfileAvatar
						user={user}
					/>
					<UsernameLink
						to={`/profile/${user.id}`}
						className="up-profile-username-link"
					>
						{user.name}
					</UsernameLink>
					<ModBadge
						badge={user.badge}
					/>
				</FlexBox>
				{message ?
					<Container style={{ padding: background ? 0 : '0 15px' }}>
						<UserPostEditor
							measure={measure || (() => { })}
							background={background || { type: 'none', id: -1 }}
							editorInitialText={
								(message.match(/\n/g) || []).length > 5 ?
									`${message.slice(0, 100)}`
									:
									message
							}
							isEditorReadOnly
						/>
						{(message.match(/\n/g) || []).length > 5 &&
							<ContainerLink to={`/post/${userPostId}`}>
								<TextBlock className="up-feed-item-continue-reading-text">...Continue Reading</TextBlock>
							</ContainerLink>
						}
					</Container>
					: null
				}
				<ContainerLink to={`/post/${userPostId}`}>
					{imageUrl ?
						<Container
							onLoad={measure || (() => { })}
							className={imageShouldWrap ? 'user-post-feed-image-container wrap' : 'user-post-feed-image-container'}
						>
							<ImageAtom src={imageUrl} className="user-post-feed-image" />
							{imageShouldWrap && <Container className="up-feed-image-shadow" />}
						</Container>
						: null}
				</ContainerLink>
				<FeedBottomBarFullStatistics
					type={type}
					date={date}
					id={id}
					userVote={vote}
					totalVotes={votes}
					comments={comments}
					views={views}
					className="up-feed-item-bottom-bar"
					commentIconLink={`/post/${userPostId}`}
				/>
			</FlexBox>
		</VisibilitySensor>
	);
};

export default UserPost;
