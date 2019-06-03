import React from 'react';
import { connect } from 'react-redux';

import SlayLesson from './SlayLesson';
import Modules from './Modules';
import Lessons from './Lessons';
import QuizManager from './QuizManager';
import Quiz from './Quiz';

const mapStateToProps = state => ({
	courses: state.courses,
});
const LessonManager = ({
	params: {
		idOrAlias, lessonName, index, quizNumber,
	}, courses,
}) => {

	if (courses.find(c => c.alias === idOrAlias)) {
		if (lessonName) {
			if (index) {
				return (
					<QuizManager
						alias={idOrAlias}
						moduleName={lessonName}
						lessonName={index}
						quizNumber={quizNumber}
					/>
				);
			}
			return <Lessons alias={idOrAlias} moduleName={lessonName} />;
		}
		return <Modules alias={idOrAlias} />;
	}
	return (<SlayLesson
		lessonId={idOrAlias}
		lessonName={lessonName}
		pageNumber={index}
	/>);
};

export default connect(mapStateToProps)(LessonManager);
