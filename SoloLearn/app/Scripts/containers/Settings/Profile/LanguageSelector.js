import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

const translations = [
	{
		name: 'English',
		locale: 'en',
	},
	{
		name: 'Русский',
		locale: 'ru',
	},
	{
		name: 'Español',
		locale: 'es',
	},
];

const CountrySelector = ({ t, value, onChange }) => (
	<SelectField
		fullWidth
		autoWidth
		value={value}
		onChange={onChange}
		floatingLabelText={t('settings.language')}
	>
		{ translations.map(item =>
			(
				<MenuItem
					key={item.name}
					value={item.locale}
					primaryText={item.name}
				/>
			))
		}
	</SelectField>
);

export default CountrySelector;
