/*
	Created by Robert Gevorgyan on 3/22/2018
	Copyright © 2017 SoloLearn Inc
	All rights reserved

	This is a small util function that determines access level of the user.
	On the moment of writing, there are 4 access levels.
	0 - normal users
	1 - Moderators, cannot affect the content but have extended report features
	2 - Gold moderators, can remove and edit the content
	3 - Platinum mode, can see the downvotes of a certain comment/discussion etc.
*/

export default (accessNumber) => {
	if ((accessNumber & 8) === 8) { // eslint-disable-line no-bitwise
		return 3;
	}
	if ((accessNumber & 4) === 4) { // eslint-disable-line no-bitwise
		return 2;
	}
	if ((accessNumber & 2) === 2) { // eslint-disable-line no-bitwise
		return 1;
	}
	return 0;
};
