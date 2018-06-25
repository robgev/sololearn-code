import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import Done from 'material-ui/svg-icons/action/done';
import Clear from 'material-ui/svg-icons/content/clear';
import { red500, green500 } from 'material-ui/styles/colors';
import './CheckIndicator.scss';

const CheckIndicator = ({ status }) => (status !== null ? (
	<Paper className="check-indicator">
		{status ? <Done color={green500} /> : <Clear color={red500} />}
		<span>{status ? 'Correct' : 'Wrong'}</span>
	</Paper>
) : null);

CheckIndicator.defaultProps = {
	status: null,
};

CheckIndicator.propTypes = {
	status: PropTypes.bool,
};

export default CheckIndicator;
