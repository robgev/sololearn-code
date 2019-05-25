import React, { useEffect, useState } from 'react';
import Service from 'api/service';
import {
	PaperContainer,
	SecondaryTextBlock,
	Link,
	FlexBox,
} from 'components/atoms';
import { ProfileAvatar, UsernameLink } from 'components/molecules';

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
			: (
				<PaperContainer className="preview-wrapper">
					<ProfileAvatar
						user={post}
					/>
					<FlexBox className="preview-info" column>
						<UsernameLink className="item">{post.userName}</UsernameLink>
						<SecondaryTextBlock className="item">
							<Link to={to}>
								{post.message}
							</Link>
						</SecondaryTextBlock>
					</FlexBox>
				</PaperContainer>
			)
	);
};

export default UserPost;
