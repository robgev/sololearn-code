import React from 'react';
import { Container, Image } from 'components/atoms';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import BottomToolbarWithVotes from '../BottomToolbarWithVotes';

const UserPost = ({
	background,
	message,
	imageUrl,
	type,
	date,
	id,
	vote,
	votes,
}) => (
	<Container>
		{message ?
			<UserPostEditor
				background={background || { type: 'none', id: -1 }}
				editorInitialText={message}
				isEditorReadOnly
			/>
			: null
		}
		{imageUrl ? <Image src={imageUrl} style={{ maxWidth: '400px' }} alt="" /> : null}
		<BottomToolbarWithVotes
			type={type}
			date={date}
			id={id}
			userVote={vote}
			totalVotes={votes}
		/>
	</Container>
);

export default UserPost;
