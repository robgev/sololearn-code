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
			<Container>
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
					<Link to={`/learn/course/${toSeoFriendly(course.name)}`}><TextBlock className="courseName">{course.name}</TextBlock></Link>
				</Container>
				{showDate && <BottomToolbar date={date} />}
			</Container>
		);
	}
}

export default Course;
