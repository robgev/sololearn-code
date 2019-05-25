import React from 'react';
import { Container } from 'components/atoms';

import './styles.scss';

import LessonPreview from './LessonPreview';
import CodePreview from './CodePreview';
import PostPreview from './PostPreview';
import CoursePreview from './CoursePreview';
import UserPost from './UserPost';

const constructLink = (link, type) => (type === 'code' ? `/playground/${link.split('https://code.sololearn.com/')[1]}` : link);

const PreviewBody = ({
	id,
	type,
	courseAlias,
	to,
}) => {
	switch (type) {
	case 'slayLesson':
		return <LessonPreview to={to} id={id} type={type} />;
	case 'code':
		return <CodePreview to={to} publicId={id} />;
	case 'discuss':
		return <PostPreview to={to} id={id} />;
	case 'course':
		return id
			? <LessonPreview to={to} id={id} type={type} />
			: <CoursePreview to={to} courseAlias={courseAlias} />;
	case 'userPost':
		return <UserPost id={id} to={to} />;
	default:
		return null;
	}
};

const PreviewItem = props => (
	<Container className={`preview-container ${props.className}`}>
		<PreviewBody {...props} to={constructLink(props.link, props.type)} />
	</Container>
);

export default PreviewItem;
