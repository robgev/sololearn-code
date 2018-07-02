import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import CheckIndicator from '../CheckIndicator';

import './CheckBar.scss';

const CheckBar = ({
	label, onClick, disabled, status, className, ...rest
}) => (
	<div className={`quiz-check-bar ${className}`}>
		<RaisedButton
			label={label}
			onClick={onClick}
			disabled={disabled}
			{...rest}
		/>
		<CheckIndicator status={status} />
	</div>
);

CheckBar.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/require-default-props
	status: PropTypes.bool, // Can be null
};

export default CheckBar;
