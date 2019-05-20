import React, { useEffect, useState } from 'react';
import Service from 'api/service';
import {
	PaperContainer,
	SecondaryTextBlock,
	Link,
} from 'components/atoms';
import { Avatar } from 'components/molecules';

import './styles.scss';

const UserPost = ({ id, to }) => {
	const [ post, setPost ] = useState(null);
	useEffect(() => {
		Service.request('Profile/GetPostMinimal', { id })
			.then(({ post }) => setPost(post));
	}, []);
	return (
		post === null
			? null
			: <PaperContainer className="preview-wrapper">
				<Avatar
					disabled
					badge={post.badge}
					avatarUrl={post.avatarUrl}
					userName={post.userName}
				/>
				<SecondaryTextBlock className="item">{post.userName}</SecondaryTextBlock>
				<Link to={to} className="item">{post.message}</Link>
     </PaperContainer>
	);
};

export default UserPost;
