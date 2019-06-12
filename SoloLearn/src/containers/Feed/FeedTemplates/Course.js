// React modules
import React from 'react';
import { connect } from 'react-redux';
import { toSeoFriendly, numberFormatter } from 'utils';
import {
	Container,
	Image,
	TextBlock,
	Link,
	FlexBox,
	SecondaryTextBlock,
} from 'components/atoms';
import { AppDefaults } from 'api/service';
import { getCourseByAlias } from 'reducers/courses.reducer';

import 'styles/Feed/FeedTemplates/Course.scss';

const Course = ({ course, courses }) => (
	<Container className="courseContainer" to={`/learn/${toSeoFriendly(course.alias)}`}>
		<Container
			tabIndex={0}
			role="button"
			className="course"
		>
			<Container className="courseIcon">
				<Image
					alt="course icon"
					src={`${AppDefaults.downloadHost}/Courses/${course.id}.png`}
					className="courseIcon"
				/>
			</Container>
			<FlexBox column className="details" >
				<Link className="courseLink" to={`/learn/${toSeoFriendly(course.alias)}`}>
					<TextBlock className="courseName">{course.name}</TextBlock>
				</Link>
				<SecondaryTextBlock className="description">Learners: {numberFormatter(courses.learners)}</SecondaryTextBlock>
			</FlexBox>
		</Container>
	</Container>
);

const mapStateToProps = (state, ownProps) => {
	const { alias } = ownProps.course;

	return {
		courses: getCourseByAlias(state, alias),
	};
};

export default connect(mapStateToProps, null)(Course);
