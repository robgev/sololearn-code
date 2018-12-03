// React modules
import React, { Component, Fragment } from 'react';
import { toSeoFriendly } from 'utils';
import BottomToolbar from '../FeedBottomToolbar';
import {
	Container,
	Image,
	TextBlock,
	Link,
} from 'components/atoms';

import 'styles/Feed/FeedTemplates/Course.scss';

class Course extends Component {
	render() {
		const { course, date, showDate = true } = this.props;

		return (
			<Link to={`/learn/course/${toSeoFriendly(course.name)}`}>
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
					<TextBlock className="courseName">{course.name}</TextBlock>
				</Container>
				{showDate && <BottomToolbar date={date} />}
			</Link>
		);
	}
}

export default Course;
