import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextBlock } from 'components/atoms';

const SwitchToggle = ({
	label, labelPlacement, labelClassName, ...props
}) => (
	<FormControlLabel
		control={
			<Switch
				color="primary"
				{...props}
			/>
		}
		className={labelClassName}
		labelPlacement={labelPlacement}
		label={<TextBlock>{label}</TextBlock>}
	/>
);

SwitchToggle.defaultProps = {
	label: '',
	labelPlacement: 'start',
};

export default SwitchToggle;
