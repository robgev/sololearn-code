import React, { useEffect, useState, useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {
	Container,
	FlexBox,
	Image as ImageAtom,
	Link,
} from 'components/atoms';
import {
	ModBadge,
	ProfileAvatar,
	UsernameLink,
	ContainerLink,
} from 'components/molecules';
import { FeedBottomBarFullStatistics } from 'components/organisms';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import { sendImpressionByPostId } from 'containers/UserPostDetails/userpostdetails.actions';

import './styles.scss';

const UserPost = ({
	user,
	background,
	message,
	imageUrl,
	date,
	id,
	vote,
	votes,
	measure = null,
	userPostId,
	comments,
	views,
}) => {
	const lineHeightDefault = 20;
	const impressionTimeoutIdRef = useRef();
	const textContainerRef = useRef();
	const [ imageShouldWrap, setImageShouldWrap ] = useState(false);
	const [ textShouldWrap, setTextShouldWrap ] = useState(false);

	const onImageLoad = (e) => {
		if (e.target.height > window.innerHeight * 0.5) {
			setImageShouldWrap(true);
		}
	};
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

	useEffect(() => {
		if (imageShouldWrap || textShouldWrap) {
			measure();
		}
	}, [ imageShouldWrap, textShouldWrap ]);

	useEffect(() => {
		if (textContainerRef && textContainerRef.current &&
			!background &&
			textContainerRef.current.clientHeight > lineHeightDefault * 5) {
			setTextShouldWrap(true);
		}
	}, []);

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
					<Container>
						<Container
							style={{
								padding: background ? 0 : '0 15px',
								lineHeight: !background ? `${lineHeightDefault}px` : '',
								height: !background && textShouldWrap ? lineHeightDefault * 5.2 : '100%',
								overflow: !background && textShouldWrap ? 'hidden' : 'auto',
							}}
							ref={textContainerRef}
						>
							<UserPostEditor
								background={background || { type: 'none', id: -1 }}
								editorInitialText={message}
								isEditorReadOnly
							/>
						</Container>
						{textShouldWrap &&
							<Link
								className="hoverable up-feed-item-continue-reading-text"
								to={`/post/${userPostId}`}
							>
								...Continue Reading
							</Link>
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
							<ImageAtom src={imageUrl} className="user-post-feed-image" onLoad={onImageLoad} />
							{imageShouldWrap && <Container className="up-feed-image-shadow" />}
						</Container>
						: null}
				</ContainerLink>
				<FeedBottomBarFullStatistics
					type="userPost"
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
