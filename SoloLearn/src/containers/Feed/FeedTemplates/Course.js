// React modules
import React from 'react';
import { toSeoFriendly } from 'utils';
import {
	Container,
	Image,
	TextBlock,
	Link,
} from 'components/atoms';
import { AppDefaults } from 'api/service';

import 'styles/Feed/FeedTemplates/Course.scss';

import BottomToolbar from '../FeedBottomToolbar';

const Course = ({ course, date, showDate = true }) => (
	<Container to={`/learn/${toSeoFriendly(course.alias)}`}>
		<Container
			tabIndex={0}
			role="button"
			className="course"
		>
			<Image
				alt="course icon"
				src={`${AppDefaults.downloadHost}/Courses/${course.id}.png`}
				className="courseIcon"
			/>
			<Link to={`/learn/${toSeoFriendly(course.alias)}`}>
				<TextBlock className="courseName">{course.name}</TextBlock>
			</Link>
		</Container>
		{showDate && <BottomToolbar date={date} />}
	</Container>
);

export default Course;
