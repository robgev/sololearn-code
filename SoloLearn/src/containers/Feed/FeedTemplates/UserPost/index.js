import React from 'react';
import {
	Container,
	Image,
	FlexBox,
} from 'components/atoms';
import {
	ContainerLink,
	ModBadge,
	ProfileAvatar,
	UsernameLink,
} from 'components/molecules';
import { FeedBottomBarFullStatistics } from 'components/organisms';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';

import './styles.scss';

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
}) => (
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
			<Container style={{ padding: background ? 0 : '0 20px' }}>
				{message ?
					<UserPostEditor
						measure={measure || (() => { })}
						background={background || { type: 'none', id: -1 }}
						editorInitialText={
							message.length > 200 ?
								`${message.slice(0, 200)}...Continue reading`
								:
								message
						}
						isEditorReadOnly
					/>
					: null
				}
			</Container>
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
);

export default UserPost;
