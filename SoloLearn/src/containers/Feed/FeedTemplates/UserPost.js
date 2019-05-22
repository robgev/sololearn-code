import React, { useRef } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Image } from 'components/atoms';
import { ContainerLink } from 'components/molecules';
import Service from 'api/service';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import { FeedBottomBarFullStatistics } from 'components/organisms';

const sendImpressionByPostId = id =>
	Service.request(`Profile/AddPostImpression?id=${id}`);

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
			<ContainerLink to={`post/${userPostId}`}>
				{message ?
					<UserPostEditor
						measure={measure || (() => { })}
						background={background || { type: 'none', id: -1 }}
						editorInitialText={message}
						isEditorReadOnly
					/>
					: null
				}
				{imageUrl ? <Image src={imageUrl} onLoad={measure || (() => { })} style={{ maxWidth: '400px' }} alt="" /> : null}
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
		</VisibilitySensor>
	);
};

export default UserPost;
