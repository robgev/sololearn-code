import PropTypes from 'prop-types';

export default PropTypes.arrayOf(PropTypes.shape({
	id: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,
	isCorrect: PropTypes.bool.isRequired,
	properties: PropTypes.shape({
		prefix: PropTypes.string,
		postfix: PropTypes.string,
	}),
}));
