import Service from 'api/service';

export const submitChallenge = quiz =>
	Service.request('Challenge/SaveChallenge', {
		challenge: { ...quiz, status: 1 },
	});

export const deleteChallenge = id =>
	Service.request('Challenge/DeleteChallenge', { id });

const getQuizFactoryEnabledCourseIds = courses => courses
	// .filter(course => course.isQuizFactoryEnabled)
	.map(({ id }) => id);

export const getReviewCourseIds = () =>
	Service.request('Challenge/GetAvailableReviewCourses')
		.then(res => getQuizFactoryEnabledCourseIds(res.courses));

export const getReviewChallenge = courseId =>
	Service.request('Challenge/GetReviewChallenge', { courseId })
		.then(res => res.challenge || null);

export const voteChallenge = (challengeId, vote) =>
	Service.request('Challenge/VoteChallenge', { challengeId, vote });

export const getMySubmissions = ({ courseId, status, index }) => {
	const options = {
		...(courseId === 0 ? {} : { courseId }),
		// status = 0 is the 'all' case
		...(status === 0 ? {} : { status }),
		index,
	};
	return Service.request('Challenge/GetChallenges', options)
		.then(res => res.challenges);
};
