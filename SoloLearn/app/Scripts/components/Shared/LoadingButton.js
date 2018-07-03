import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const LoadingButton = ({
	raised = false, label = 'label', loading = false, disabled = false, ...rest
}) => {
	const Button = raised ? RaisedButton : FlatButton;
	return (
		<Button
			{...{
				style: { width: 120 },
				label: loading ? 'Loading...' : label,
				disabled: disabled || loading,
				...rest,
			}}
		/>
	);
};

export default LoadingButton;
