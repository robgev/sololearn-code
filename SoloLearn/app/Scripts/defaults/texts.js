import i18n from 'i18n';
// App texts

const texts = {
	// Popups
	// popupYes: 'Yes',
	// popupNo: 'No',
	get popupOk() {
		return i18n.t('common.ok-title');
	},
	get popupCancel() {
		return i18n.t('common.cancel-title');
	},
	// popupRetry: 'Retry',
	get popupDelete() {
		return i18n.t('common.delete-title');
	},

	// Hints
	get hintHintConfirmText() {
		return i18n.t('learn.get-hint-format');
	},
	get hintHintConfirmApply() {
		return i18n.t('common.ok-title');
	},
	get hintSkipConfirmText() {
		return i18n.t('learn.popups.unlock.description');
	},
	get hintSkipConfirmApply() {
		return i18n.t('learn.popups.unlock-popup-ok-action-title');
	},
	get hintNoEnoughPoints() {
		return i18n.t('learn.hint-not-enough-xp');
	},
	// hintSkipTip: 'Unlock the answer',
	// hintHintTip: 'Get a hint',

	// Congrats
	// congratsTitle: 'Congratulations',
	// congratsPendingTitle: 'Certificate',
	// congratsPoints: 'Points: {placeholder}',
	// congratsContinue: 'Continue Learning',
	// congratsShare: 'Share',
	// congratsPending: 'Complete the course to unlock your certificate',
	// congratsComplete: 'You have successfully completed the <nobr>{placeholder}</nobr> course',

	// Quiz
	// quizResultWrong: 'Wrong',
	// quizResultCorrect: 'Correct!',
	// quizAttempts: 'Attempt: ',
	// quizResultWrongBackToVideo: 'Back',

	// Profile
	// resetProgressConfirmText: 'All your progress on this course will be lost. Are you sure you want to continue?',
	get resetContinue() {
		return i18n.t('learn.reset-course-popup-title');
	},

	// Shortcut
	get shortcutButton() {
		return i18n.t('learn.take-shortcut');
	},
	// closeShortcut: 'Are you sure you want to leave the test?',
	get shortcutFailed() {
		return i18n.t('learn.lesson-test-failed-message');
	},
	get shortcutSucceed() {
		return i18n.t('learn.test-completed-message');
	},
	get shortcutContinue() {
		return i18n.t('learn.buttons-continue');
	},
	// shortcutLeave: 'LEAVE',

	// Comments
	get commentDeleteConfirmText() {
		return i18n.t('comments.delete-comment-popup-message');
	},

	// Playground
	// c_cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n\treturn 0;\n}',
	// java: 'public class Program\n{\n\tpublic static void main(String[] args) {\n\t\t\n\t}\n}',
	// php: '<?php\n\n?>',
	// html: '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>Page Title</title>\n\t</head>\n\t<body>\n\t\t\n\t</body>\n</html>',
	// jqueryHtml: '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>Page Title</title>\n\t\t<script src=\"https://code.jquery.com/jquery-3.1.1.js\"></script>\n\t</head>\n\t<body>\n\t\t\n\t</body>\n</html>',
	// jquery: '$(function() {\n\t\n});',
	// css: 'body {\n\t\n}',
	// javascript: '',
	// python: '',
	// csharp: 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\nusing System.Threading.Tasks;\n\n\nnamespace SoloLearn\n{\n\tclass Program\n\t{\n\t\tstatic void Main(string[] args)\n\t\t{\n\t\t\t\n\t\t}\n\t}\n}\n',
	// ruby: '',

	get inputsPopupTitle() {
		return i18n.t('code_playground.alert.input-needs-title');
	},
	// inputsPopupSubTitle: 'Split multiple inputs into separate lines',
	get savePopupTitle() {
		return i18n.t('code_playground.popups.save-popup-title');
	},
	get savePopupSubTitle() {
		return i18n.t('code_playground.popups.save-popup-code-name-placeholder');
	},
	get codeNameError() {
		return i18n.t('code_playground.alert.invalid-name-title');
	},
	externalSourcePopupTitle: 'External Resources',
	externalSourcePopupSubTitle: 'Coose source:',

	// Discuss
	get postDeleteConfirmText() {
		return i18n.t('discuss.delete-question-message');
	},
	// Settings
	get challengesBanner() {
		return i18n.t('weapons.section-header-title');
	},
	get customizeFeed() {
		return i18n.t('notification_settings.feed-section-title');
	},
	feedItemNames: {
		get feedAchievements() {
			return i18n.t('notification_settings.feed-profile-updates');
		},
		get feedPostQuestions() {
			return i18n.t('notification_settings.feed-questions');
		},
		get feedPostAnswers() {
			return i18n.t('notification_settings.feed-answers');
		},
		get feedCodes() {
			return i18n.t('notification_settings.feed-codes');
		},
		get feedCourses() {
			return i18n.t('notification_settings.feed-courses');
		},
		get feedLessons() {
			return i18n.t('notification_settings.feed-lessons');
		},
		get feedChallenges() {
			return i18n.t('notification_settings.feed-challenges');
		},
		get feedLessonComments() {
			return i18n.t('notification_settings.feed-lesson-comments');
		},
		get feedCodeComments() {
			return i18n.t('notification_settings.feed-code-comments');
		},
	},

	// Leaderboards
	get today() {
		return i18n.t('leaderboard.picker.day-title');
	},
	get thisWeek() {
		return i18n.t('leaderboard.picker.week-title');
	},
	get thisMonth() {
		return i18n.t('leaderboard.picker.month-title');
	},
	get allTime() {
		return i18n.t('leaderboard.picker.global-title');
	},
	get following() {
		return i18n.t('leaderboard.tab.following-title');
	},
	get local() {
		return i18n.t('leaderboard.tab.local-title');
	},
	get global() {
		return i18n.t('leaderboard.tab.global-title');
	},
	get next() {
		return i18n.t('leaderboard.header.own-title');
	},
};

export default texts;
