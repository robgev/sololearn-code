import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

const translations = [
	{
		name: 'English',
		locale: 'en',
		code: 'us',
	},
	{
		name: 'Русский',
		locale: 'ru',
		code: 'ru',
	},
	{
		name: 'Español',
		locale: 'es',
		code: 'es',
	},
];

const CountrySelector = ({ t, value, onChange }) => (
	<SelectField
		fullWidth
		autoWidth
		value={value}
		onChange={onChange}
		labelStyle={{ top: 15 }}
		floatingLabelText={t('settings.language')}
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
		{ translations.map(item =>
			(
				<MenuItem
					key={item.name}
					value={item.locale}
					primaryText={item.name}
					leftIcon={
						<img
							alt={item.name}
							style={{ height: 'initial', width: 26 }}
							src={`/assets/flags/${item.code}.png`}
						/>
					}
				/>
			))
		}
	</SelectField>
);

export default CountrySelector;
