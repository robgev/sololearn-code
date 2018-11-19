import React from 'react';
import Progressbar from 'components/Progressbar';
import {
	Container,
	Image,
	Link,
	SecondaryTextBlock,
	TextBlock,
	CircularProgress,
} from 'components/atoms';
import { translate } from 'react-i18next';

const SkillChips = ({ t, course, shouldShowLink }) => (
	<Container className="course">
		<Container className="course-progress flex-centered">
			<CircularProgress percentage={course.progress * 100} />
			<Image
				alt={course.name}
				className="course-icon"
				src={`https://api.sololearn.com/uploads/Courses/${course.id}.png`}
			/>
		</Container>
		<Container className="course-details">
			<TextBlock className="course-name">{course.languageName}</TextBlock>
			<br/>
			<SecondaryTextBlock className="course-xp">{course.xp} XP</SecondaryTextBlock>
			{(course.progress >= 1 && shouldShowLink) &&
				<Link to={`/certificate/${course.id}`}>
					{t('skills.view-certificate')}
				</Link>
			}
		</Container>
	</Container>
);

export default translate()(SkillChips);
