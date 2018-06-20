import React, { Component } from 'react';
import PropTypes from 'prop-types';
import answersType from './answersType';

import { MultipleChoice, TypeIn, FillIn, PlaceholderDnD, Reorder } from './';

export const AnswersComponents = { // Mapping from quiz types to components
	1: MultipleChoice,
	2: TypeIn,
	3: FillIn,
	6: PlaceholderDnD,
	8: Reorder,
};

class AnswersSelector extends Component {
	unlock = () => {
		this.answersComp.unlock();
		this.props.onCheck(true);
	}
	check = () => {
		this.props.onCheck(this.answersComp.check());
	}
	hint = () => {
		if (this.answersComp.hint() === true) {
			this.props.onCheck(true);
		}
	}
	render() {
		const { quizType, answers } = this.props;
		const AnswersComp = AnswersComponents[quizType];
		return (<AnswersComp answers={answers} ref={(a) => { this.answersComp = a; }} />);
	}
}

AnswersSelector.defaultProps = {
	onCheck: () => { }, // noop
};

AnswersSelector.propTypes = {
	quizType: PropTypes.oneOf([ 1, 2, 3, 6, 8 ]).isRequired, // See AnswersComponents for mapping info
	answers: answersType.isRequired,
	onCheck: PropTypes.func,
};

export default AnswersSelector;
