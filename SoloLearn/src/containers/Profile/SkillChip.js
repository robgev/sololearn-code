import React from 'react';
import Progressbar from 'components/Progressbar';
import {
	Container,
	Image,
	Link,
	SecondaryTextBlock,
	TextBlock,
	CircularProgress,
	FlexBox,
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
		<FlexBox column >
			<TextBlock >{course.languageName}</TextBlock>
			<SecondaryTextBlock >{course.xp} XP</SecondaryTextBlock>
			{(course.progress >= 1 && shouldShowLink) &&
				<Link to={`/certificate/${course.id}`}>
					<SecondaryTextBlock >{t('skills.view-certificate')}</SecondaryTextBlock>
				</Link>
			}
		</FlexBox>
	</Container>
);

export default translate()(SkillChips);
