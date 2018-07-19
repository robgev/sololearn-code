import React from 'react';
import { Link } from 'react-router';

import 'styles/components/PreviewItem.scss';

import LessonPreview from './LessonPreview';
import CodePreview from './CodePreview';
import PostPreview from './PostPreview';
import CoursePreview from './CoursePreview';

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
	<Link to={props.link} className="preview-container">
		<PreviewBody {...props} />
	</Link>
);

export default PreviewItem;
