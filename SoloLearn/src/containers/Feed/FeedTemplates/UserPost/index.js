import React, { useEffect, useState, useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {
	Container,
	FlexBox,
	Image as ImageAtom,
	Link,
} from 'components/atoms';
import {
	ContainerLink,
} from 'components/molecules';
import { FeedBottomBarFullStatistics } from 'components/organisms';
import { ImageIcon } from 'components/icons';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import { sendImpressionByPostId } from 'containers/UserPostDetails/userpostdetails.actions';

import './styles.scss';

const UserPost = ({
	background,
	message,
	imageUrl,
	date,
	id,
	vote,
	votes,
	measure = null,
	onChange,
	userPostId,
	comments,
	views,
}) => {
	const lineHeightDefault = 20;
	const impressionTimeoutIdRef = useRef(null);
	const textContainerRef = useRef(null);
	const [ imageShouldWrap, setImageShouldWrap ] = useState(false);
	const [ textShouldWrap, setTextShouldWrap ] = useState(false);
	const [ isImageLoaded, setImageLoaded ] = useState(false);

	const onImageLoad = (e) => {
		setImageLoaded(true);
		const el = e.target;
		window.setTimeout(() => {
			if (el.height > window.innerHeight * 0.5) {
				setImageShouldWrap(true);
			}
		}, 0);
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
		measure();
	}, [ isImageLoaded ]);

	useEffect(() => {
		if (!background &&
			textContainerRef.current &&
			textContainerRef.current.clientHeight > lineHeightDefault * 5
		) {
			setTextShouldWrap(true);
		}
	}, []);

	return (
		<VisibilitySensor
			scrollCheck
			delayedCall
			scrollThrottle={100}
			onChange={onVisibilityChange}
		>
			<FlexBox column className="user-post-feed-item-container">
				{message ?
					<Container>
						<Container
							style={{
								lineHeight: !background ? `${lineHeightDefault}px` : '',
								height: !background && textShouldWrap ? lineHeightDefault * 5.2 : '100%',
								overflow: !background && textShouldWrap ? 'hidden' : 'auto',
							}}
							ref={textContainerRef}
						>
							<UserPostEditor
								key={userPostId}
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
							className={imageShouldWrap ? 'user-post-feed-image-container wrap' : 'user-post-feed-image-container'}
						>
							{!isImageLoaded &&
								<FlexBox
									justify
									align
									className="user-post-feed-image-placeholder"
								>
									<ImageIcon className="up-placeholder-image-icon" />
								</FlexBox>
							}
							<ImageAtom
								src={imageUrl}
								className="user-post-feed-image"
								onLoad={onImageLoad}
								style={{ display: isImageLoaded ? '' : 'none' }}
							/>
							{imageShouldWrap && <Container className="up-feed-image-shadow" />}
						</Container>
						: null}
				</ContainerLink>
				<FeedBottomBarFullStatistics
					id={id}
					key={id}
					date={date}
					views={views}
					userVote={vote}
					type="userPost"
					withDate={false}
					totalVotes={votes}
					onChange={onChange}
					comments={comments}
					className="up-feed-item-bottom-bar"
					commentIconLink={`/post/${userPostId}`}
				/>
			</FlexBox>
		</VisibilitySensor>
	);
};

export default UserPost;
