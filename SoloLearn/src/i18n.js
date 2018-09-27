import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import Storage from 'api/storage';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(reactI18nextModule)
	.init({
		fallbackLng: 'en',

		// have a common namespace used around the full app
		ns: [ 'translations' ],
		defaultNS: 'translations',

		debug: true,
		backend: {
			// path where resources get loaded from, or a function
			// returning a path:
			// function(lngs, namespaces) { return customPath; }
			// the returned path will interpolate lng, ns if provided like giving a static path
			loadPath: '/assets/{{ns}}/{{lng}}.json',

			// path to post missing resources
			addPath: '/assets/{{ns}}/{{lng}}',
		},
		interpolation: {
			escapeValue: false, // not needed for react!!
		},

		react: {
			wait: true,
		},
	})
	.changeLanguage(Storage.load('locale') || 'en', (err) => {
		if (err) { console.log('something went wrong loading', err); }
	});

export default i18n;
