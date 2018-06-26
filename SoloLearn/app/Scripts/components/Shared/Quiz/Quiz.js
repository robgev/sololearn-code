import React from 'react';
import PropTypes from 'prop-types';
import { quizType } from './components/types';

import { MultipleChoice, TypeIn, FillIn, PlaceholderDnD, Reorder } from './components';
import './styles.scss';

const Quiz = (props) => {
	switch (props.quiz.type) {
	case 1:
		return <MultipleChoice {...props} />;
	case 2:
		return <TypeIn {...props} />;
	case 3:
		return <FillIn {...props} />;
	case 6:
		return <PlaceholderDnD {...props} />;
	case 8:
		return <Reorder {...props} />;
	default:
		throw new Error('Quiz type not recognized');
	}
};

Quiz.defaultProps = {
	unlockable: false,
	canTryAgain: false,
	onTryAgain: () => { },
};

Quiz.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool,
	canTryAgain: PropTypes.bool,
	onTryAgain: PropTypes.func,
};

export default Quiz;
