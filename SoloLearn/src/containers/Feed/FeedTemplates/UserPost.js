import React from 'react';
import { Container, Image } from 'components/atoms';
import { ContainerLink } from 'components/molecules';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import { FeedBottomBarFullStatistics } from 'components/organisms';

const UserPost = ({
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
	<ContainerLink to={`post/${userPostId}`}>
		{message ?
			<UserPostEditor
				measure={measure || (() => {})}
				background={background || { type: 'none', id: -1 }}
				editorInitialText={message}
				isEditorReadOnly
			/>
			: null
		}
		{imageUrl ? <Image src={imageUrl} onLoad={measure || (() => {})} style={{ maxWidth: '400px' }} alt="" /> : null}
		<FeedBottomBarFullStatistics
			type={type}
			date={date}
			id={id}
			userVote={vote}
			totalVotes={votes}
			comments={comments}
			views={views}
		/>
	</ContainerLink>
);

export default UserPost;
