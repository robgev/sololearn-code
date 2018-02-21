import i18n from 'i18n';
export default [
	{
		id: 1,
		get name() {
			return i18n.t('tab.learn');
		},
		url: '/learn',
		imgUrl: 'tab_learn.png',
	},
	{
		id: 2,
		get name() {
			return i18n.t('tab.play');
		},
		url: '/contests',
		imgUrl: 'tab_play.png',
	},
	{
		id: 3,
		get name() {
			return i18n.t('tab.code');
		},
		url: '/codes',
		aliasUrl: '/playground',
		imgUrl: 'tab_practice.png',
	},
	{
		id: 4,
		get name() {
			return i18n.t('tab.discuss');
		},
		url: '/discuss',
		imgUrl: 'tab_discuss.png',
	},
];
