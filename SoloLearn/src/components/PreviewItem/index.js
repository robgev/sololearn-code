import React from 'react';
//import { Link } from 'react-router';
import { Link, } from 'components/atoms';

import 'styles/components/PreviewItem.scss';

import LessonPreview from './LessonPreview';
import CodePreview from './CodePreview';
import PostPreview from './PostPreview';
import CoursePreview from './CoursePreview';

const constructLink = (link, type) => (type === 'code' ? `/playground/${link.split('https://code.sololearn.com/')[1]}` : link);

const PreviewBody = ({
	id,
	type,
	recompute,
	courseAlias,
}) => {
	switch (type) {
	case 'slayLesson':
		return <LessonPreview id={id} type={type} recompute={recompute} />;
	case 'code':
		return <CodePreview publicId={id} recompute={recompute} />;
	case 'discuss':
		return <PostPreview id={id} recompute={recompute} />;
	case 'course':
		return id
			? <LessonPreview id={id} type={type} recompute={recompute} />
			: <CoursePreview courseAlias={courseAlias} recompute={recompute} />;
	default:
		return null;
	}
};

const PreviewItem = props => (
	<Link to={constructLink(props.link, props.type)} className={`preview-container ${props.className}`}>
		<PreviewBody {...props} />
	</Link>
);

export default PreviewItem;
