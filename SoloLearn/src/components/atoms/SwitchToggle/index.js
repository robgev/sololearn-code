import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextBlock } from 'components/atoms';

const SwitchToggle = ({ label, labelPlacement, ...props }) => (
	<FormControlLabel
		control={
			<Switch
				color="primary"
				{...props}
			/>
		}
		label={<TextBlock>{label}</TextBlock>}
		labelPlacement={labelPlacement}
	/>
);

SwitchToggle.defaultProps = {
	label: '',
	labelPlacement: 'start',
};

export default SwitchToggle;
