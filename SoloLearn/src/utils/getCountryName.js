import countries from 'constants/Countries.json';

export default (countryCode) => {
	const foundCountry = countries.find(c => c.code === countryCode);
	return foundCountry ? foundCountry.name : '';
};
