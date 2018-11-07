import React from 'react';
import countries from 'constants/Countries.json';

import {
	Select,
	MenuItem,
	SecondaryTextBlock,
	Container,
	Image
} from 'components/atoms';

const items = countries.map(country =>
	(
		<MenuItem
			key={country.name}
			value={country.code}
		>
			{
				country.code === 'NST' ?
					<Container className="settings_menu_item_image" /> :
					<Image
						alt={country.name}
						className="settings_menu_item_image"
						src={`/assets/flags/${country.code.toLowerCase()}.png`}
					/>
			}
			{country.name}
		</MenuItem>
	));

const CountrySelector = ({ t, value, onChange }) => (
	<Container className='settings_country_selector_container'>
		<SecondaryTextBlock>{t('country.title')}</SecondaryTextBlock>
		<Select
			fullWidth
			autoWidth
			value={value}
			maxHeight={200}
			onChange={onChange}
		>
			{ items }
		</Select>
	</Container>
);

export default CountrySelector;
