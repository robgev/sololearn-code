// React modules
import React from 'react';
import { toSeoFriendly } from 'utils';
import {
	Container,
	Image,
	TextBlock,
	Link,
} from 'components/atoms';

import 'styles/Feed/FeedTemplates/Course.scss';

import BottomToolbar from '../FeedBottomToolbar';

const Course = ({ course, date, showDate = true }) => (
	<Container to={`/learn/course/${toSeoFriendly(course.name)}`}>
		<Container
			tabIndex={0}
			role="button"
			className="course"
		>
			<Image
				alt="course icon"
				src={`https://api.sololearn.com/uploads/Courses/${course.id}.png`}
				className="courseIcon"
			/>
			<Link to={`/learn/course/${toSeoFriendly(course.name)}`}>
				<TextBlock className="courseName">{course.name}</TextBlock>
			</Link>
		</Container>
		{showDate && <BottomToolbar date={date} />}
	</Container>
);

export default Course;
