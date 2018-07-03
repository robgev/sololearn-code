import React, { Component } from 'react';
import PropTypes from 'prop-types';
import quizType from './components/types';

import { MultipleChoice, TypeIn, FillIn, PlaceholderDnD, Reorder } from './components';
import './styles.scss';

class Quiz extends Component {
	unlock = () => {
		this.quiz.unlock();
	}
	hint = () => {
		this.quiz.hint();
	}
	tryAgain = () => {
		this.quiz.tryAgain();
	}
	check = () => this.quiz.check();
	render() {
		const { quiz } = this.props;
		const forward = { ...this.props, ref: (c) => { this.quiz = c; } };
		switch (quiz.type) {
		case 1:
			return <MultipleChoice {...forward} />;
		case 2:
			return <TypeIn {...forward} />;
		case 3:
			return <FillIn {...forward} />;
		case 6:
			return <PlaceholderDnD {...forward} />;
		case 8:
			return <Reorder {...forward} />;
		default:
			throw new Error('Quiz type not recognized');
		}
	}
}

Quiz.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Quiz;
