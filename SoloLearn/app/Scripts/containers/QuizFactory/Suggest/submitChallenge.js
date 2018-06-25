import Service from 'api/service';

export default quiz => Service.request(
	'Challenge/SaveChallenge',
	{ challenge: { ...quiz, status: 1 } },
);
