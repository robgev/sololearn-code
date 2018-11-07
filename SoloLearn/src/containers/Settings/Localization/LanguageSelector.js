import React from 'react';

import {
	Select,
	MenuItem,
	SecondaryTextBlock,
	Container,
	Image
} from 'components/atoms';

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
	<Container className='settings_language_selector_container'>
		<SecondaryTextBlock>{t('settings.language')}</SecondaryTextBlock>
		<Select
			fullWidth
			autoWidth
			value={value}
			onChange={onChange}
			label={t('settings.language')}
			
		>
			{ translations.map(item =>
				(

					<MenuItem
						key={item.name}
						value={item.locale}
					>
						<Image
							alt={item.name}
							className="settings_menu_item_image"
							src={`/assets/flags/${item.code}.png`}
						/>
						{item.name}
					</MenuItem>
				))
			}
		</Select>
	</Container>
);

export default CountrySelector;
