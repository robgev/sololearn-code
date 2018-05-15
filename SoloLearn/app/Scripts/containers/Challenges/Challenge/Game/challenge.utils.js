import { QuizType } from 'containers/Learn/QuizSelector';

/* eslint import/prefer-default-export: 0 */

export const getTime = (contest, index) => {
	const quiz = contest.challenges[index];
	const { player } = contest;
	let time = 30;
	time += Math.floor((quiz.question.length - 50) / 15);
	if (player.level.integerValue < 6) {
		time += player.level.integerValue;
	} else {
		time += 6;
	}
	if (quiz.type === QuizType.PlaceholderTypeIn) {
		const isDigitRegex = new RegExp(/\d/);
		const isLetterRegex = new RegExp(/[[:alpha:]]/);
		quiz.answers.forEach(({ text }) => {
			text.split().forEach((letter) => {
				if (isDigitRegex.test(letter) || isLetterRegex.test(letter)) {
					time += 0.5;
				} else {
					time += 1;
				}
			});
		});
	}
	return time;
};

export const countResult = resultsArray =>
	resultsArray.reduce((acc, item) => (item.isCompleted ? acc + 1 : acc), 0);
