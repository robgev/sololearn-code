const Faults = {
	WrongCredentials: 1,
	NotActivated: 2,
	IncorrectEmail: 4,
	IncorrectName: 8,
	ExistingEmail: 16,
	IncorrectPassword: 32,
	DeviceNotFound: 64,
	SocialConflict: 128,
};

export default num => Object.values(Faults).filter(value => (num & value) === value);
