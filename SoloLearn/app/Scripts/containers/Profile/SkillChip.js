import React from 'react';
import { Circle } from 'react-progressbar.js';

const SkillChips = ({ course }) => (
	<div className="course">
		<div className="course-progress">
			<Circle
				progress={course.progress}
				options={{
					color: '#37474F',
					strokeWidth: 5,
					trailColor: '#E0E0E0',
					trailWidth: 5,
				}}
				containerStyle={{
					width: 75,
					height: 75,
				}}
			/>
			<img
				alt={course.name}
				className="course-icon"
				src={`https://api.sololearn.com/uploads/Courses/${course.id}.png`}
			/>
		</div>
		<div className="course-details">
			<p className="course-name">{course.languageName}</p>
			<p className="course-xp">{course.xp} XP</p>
		</div>
	</div>
);

export default SkillChips;
