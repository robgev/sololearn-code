import React, { useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import {
	Container,
	Image,
	FlexBox,
	TextBlock,
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
				<ContainerLink to={`/post/${userPostId}`}>
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
							{(message.match(/\n/g) || []).length > 5 ?
								<TextBlock className="up-feed-item-continue-reading-text">...Continue Reading</TextBlock> : null
							}
						</Container>
						: null
					}
					{imageUrl ?
						<Image
							src={imageUrl}
							onLoad={measure || (() => { })}
							className="user-post-feed-image"
						/>
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
				/>
			</FlexBox>
		</VisibilitySensor>
	);
};

export default UserPost;
