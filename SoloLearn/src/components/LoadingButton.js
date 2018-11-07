import React, { Component } from 'react';
import Localize from 'components/Localize';
//import FlatButton from 'material-ui/FlatButton';
//import RaisedButton from 'material-ui/RaisedButton';
import { FlatButton, RaisedButton } from 'components/molecules';

const LoadingButton = ({
	raised = false, label = 'label', loading = false, disabled = false, ...rest
}) => {
	const labelStyle = disabled || loading ? { labelStyle: { color: 'rgba(0, 0, 0, 0.3)' } } : {};
	const Button = raised ? RaisedButton : FlatButton;
	return (
		<Localize>
			{({ t }) => (
				<Button
					{...{
						style: { width: 120 },
						//label: loading ? t('common.loading') : label,
						disabled: disabled || loading,
						...rest,
						...labelStyle,
					}}
				>
				{(loading ? t('common.loading') : label)}
				</Button>
			)}
		</Localize>
	);
};

// Specific case of LoadingButton so named export,
// Handles loading logic by itself, should provide onClick: () => Promise
export class PromiseButton extends Component {
	state = { isLoading: false }
	onClick = async () => {
		this.setState({ isLoading: true });
		await this.props.onClick();
		this.setState({ isLoading: false });
	}
	render() {
		return (
			<LoadingButton {...this.props} loading={this.state.isLoading} onClick={this.onClick} />
		);
	}
}

export default LoadingButton;
