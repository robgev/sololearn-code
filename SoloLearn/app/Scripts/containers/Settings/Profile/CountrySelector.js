import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import countries from 'constants/Countries.json';

const items = countries.map(country =>
	(
		<MenuItem
			key={country.name}
			value={country.code}
			primaryText={country.name}
			leftIcon={
				country.code === 'NST' ?
					<div style={{ height: 26, width: 26 }} /> :
					<img
						alt={country.name}
						style={{ height: 'initial', width: 26 }}
						src={`/assets/flags/${country.code.toLowerCase()}.png`}
					/>
			}
		/>
	));

const CountrySelector = ({ t, value, onChange }) => (
	<SelectField
		fullWidth
		autoWidth
		value={value}
		maxHeight={200}
		onChange={onChange}
		floatingLabelText={t('country.title')}
		labelStyle={{ top: 15 }}
		selectionRenderer={(_, { type: RenderedMenuItem, props }) =>
			(<RenderedMenuItem
				{...props}
				disabled
				style={{
					fontSize: 15,
					minHeight: 32,
					lineHeight: '38px',
					color: 'rgba(0, 0, 0, 0.87)',
				}}
			/>)
		}

	>
		{ items }
	</SelectField>
);

export default CountrySelector;

// selectionRenderer={(_, { type: PseudoMenuItem, props }) =>
// (<PseudoMenuItem
// 	{...props}
// 	disabled
// 	style={{
// 		fontSize: 15,
// 		lineHeight: 32,
// 		minHeight: 32,
// 	}}
// />)
// }
