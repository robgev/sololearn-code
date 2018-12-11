import React from 'react';
import { Container } from 'components/atoms';

import 'styles/components/PreviewItem.scss';
import './styles.scss';

import LessonPreview from './LessonPreview';
import CodePreview from './CodePreview';
import PostPreview from './PostPreview';
import CoursePreview from './CoursePreview';

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
