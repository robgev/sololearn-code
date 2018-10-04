const Faults = {
	InvalidUsernameOrPassword: 1,
	NotActivated: 2,
	IncorrectEmail: 4,
	IncorrectName: 8,
	ExistingEmail: 16,
	IncorrectPassword: 32,
	DeviceNotFound: 64,
	SocialConflict: 128,
	AccessDenied: 256,
	ObjectNotFound: 512,
	LimitReached: 1024,
};

export default num => Object.keys(Faults).filter(key => (num & Faults[key]) === Faults[key]);
