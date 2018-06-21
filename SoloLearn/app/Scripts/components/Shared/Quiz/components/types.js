import PropTypes from 'prop-types';

export const answersType = PropTypes.arrayOf(PropTypes.shape({
	id: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,
	isCorrect: PropTypes.bool.isRequired,
	properties: PropTypes.shape({
		prefix: PropTypes.string,
		postfix: PropTypes.string,
	}),
}));

export const quizType = PropTypes.shape({
	id: PropTypes.number,
	answers: answersType.isRequired,
	question: PropTypes.string.isRequired,
	type: PropTypes.oneOf([ 1, 2, 3, 6, 8 ]),
});
