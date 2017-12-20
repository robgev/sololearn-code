import React from 'react';
import { FlatButton, RaisedButton } from 'material-ui';

const LoadingButton = ({
	raised = false, label = 'label', loading = false, disabled = false, ...rest
}) => {
	const Button = raised ? RaisedButton : FlatButton;
	return (
		<Button
			{...{
				label: loading ? 'Loading...' : label,
				disabled: disabled || loading,
				...rest,
			}}
		/>
	);
};

export default LoadingButton;
