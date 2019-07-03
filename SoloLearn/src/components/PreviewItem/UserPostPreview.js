import React, { useEffect, useState } from 'react';
import Service from 'api/service';
import {
	PaperContainer,
	SecondaryTextBlock,
	Link,
	FlexBox,
} from 'components/atoms';
import {
	ProfileAvatar,
	UsernameLink,
	ModBadge,
} from 'components/molecules';

import './styles.scss';

const previewMessage = (message) => {
	if (message.length > 200) {
		return message.slice(0, 200) + '...';
	}
	return message || '[image]';
};

const UserPostPreview = ({ id, to }) => {
	const [post, setPost] = useState(null);
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
						avatarImageClassName="preview-avatar"
					/>

					<FlexBox className="preview-info" column>
						<FlexBox align>
							<UsernameLink className="item item-user-name">{post.userName}</UsernameLink>
							<ModBadge badge={post.badge} />
						</FlexBox>
						<SecondaryTextBlock className="item-up-message">
							<Link to={to}>
								{previewMessage(post.message)}
							</Link>
						</SecondaryTextBlock>
					</FlexBox>
				</PaperContainer>
			)
	);
};

export default UserPostPreview;
