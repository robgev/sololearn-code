import i18n from 'i18n';
// App texts

const texts = {
	get popupOk() {
		return i18n.t('common.ok-title');
	},
	get popupCancel() {
		return i18n.t('common.cancel-title');
	},
	get popupDelete() {
		return i18n.t('common.delete-title');
	},
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
	get resetContinue() {
		return i18n.t('learn.reset-course-popup-title');
	},
	get shortcutButton() {
		return i18n.t('learn.take-shortcut');
	},
	get shortcutFailed() {
		return i18n.t('learn.lesson-test-failed-message');
	},
	get shortcutSucceed() {
		return i18n.t('learn.test-completed-message');
	},
	get shortcutContinue() {
		return i18n.t('learn.buttons-continue');
	},
	get commentDeleteConfirmText() {
		return i18n.t('comments.delete-comment-popup-message');
	},
	get inputsPopupTitle() {
		return i18n.t('code_playground.alert.input-needs-title');
	},
	get savePopupTitle() {
		return i18n.t('code_playground.popups.save-popup-title');
	},
	get savePopupSubTitle() {
		return i18n.t('code_playground.popups.save-popup-code-name-placeholder');
	},
	get postDeleteConfirmText() {
		return i18n.t('discuss.delete-question-message');
	},
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
		get feedUserPosts() {
			return i18n.t('notification_settings.feed-user-posts');
		},
	},
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
