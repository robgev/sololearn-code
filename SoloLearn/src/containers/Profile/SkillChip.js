import React from 'react';
import { Link } from 'react-router';
import Progressbar from 'components/Progressbar';

// i18next
import { translate } from 'react-i18next';

const SkillChips = ({ t, course, shouldShowLink }) => (
	<div className="course">
		<div className="course-progress">
			<Progressbar percentage={course.progress * 100} />
			<img
				alt={course.name}
				className="course-icon"
				src={`https://api.sololearn.com/uploads/Courses/${course.id}.png`}
			/>
		</div>
		<div className="course-details">
			<p className="course-name">{course.languageName}</p>
			<p className="course-xp">{course.xp} XP</p>
			{(course.progress >= 1 && shouldShowLink) &&
				<Link className="hoverable" to={`/certificate/${course.id}`}>
					{t('skills.view-certificate')}
				</Link>
			}
		</div>
	</div>
);

export default translate()(SkillChips);
