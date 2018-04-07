// React modules
import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';

// Service
import Progress, { ProgressState } from 'api/progress';

// Popups
import Popup from 'api/popupService';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from 'actions/defaultActions';
import { loadCourseInternal, setShortcutLesson } from 'actions/learn';
import { isLoaded, defaultsLoaded } from 'reducers';

// Additional data and components
import QuizManager from './QuizManager';

// Marterial UI components
import FlatButton from 'material-ui/FlatButton';

// i18n
import { translate } from 'react-i18next';

class Shortcut extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			shortcutLives: null,
			isShortcutCorrectCounts: 0,
			shortcutPassed: false,
		};
		document.title = 'Shortcut Quiz';
	}

    backToLearn = () => {
    	browserHistory.push(`/learn/${this.props.params.courseName}`);
    }

    render() {
    	const { course, isLoaded, defaultsLoaded } = this.props;

    	const failedActions = [
    		{
    			componentType: FlatButton,
    			label: 'popupOk',
    			primary: true,
    			actionCallback: this.backToLearn,
    		},
    	];

    	const successActions = [
    		{
    			componentType: FlatButton,
    			label: 'shortcutContinue',
    			primary: true,
    			actionCallback: this.backToLearn,
    		},
    	];

    	const childrenWithProps = React.Children.map(
    		this.props.children,
    		child => React.cloneElement(child, {
    			updateShorctutData: this.updateShorctutData,
    			exitShortcut: this.exitShortcut,
    			isShortcut: true,
    			shortcutLesson: this.props.shortcutLesson,
    			shortcutLives: this.state.shortcutLives,
    			isShortcutCorrectCounts: this.state.isShortcutCorrectCounts,
    		}),
    	);

    	return (
    		!isLoaded ? <div>Loading...</div> :
    			<div>
	{childrenWithProps}
	{ this.state.shortcutLives == 0 && Popup.getPopup(Popup.generatePopupActions(failedActions), this.state.shortcutLives == 0, this.backToLearn, [ { key: 'shortcutFailed', replacemant: '' } ], true) }
	{ this.state.shortcutPassed && Popup.getPopup(Popup.generatePopupActions(successActions), this.state.shortcutPassed, this.backToLearn, [ { key: 'shortcutSucceed', replacemant: '' } ], true) }
    			</div>
    	);
    }

    updateShorctutData = (lives, correctCounts) => {
    	this.setState({
    		shortcutLives: lives,
    		isShortcutCorrectCounts: correctCounts,
    	});
    }

    exitShortcut = () => {
    	this.setState({ shortcutPassed: true });
    }

    createShortcutLesson = (moduleId) => {
    	const { course: { modules }, setShortcutLesson } = this.props;
    	const moduleIndex = modules.findIndex(module => module.id == moduleId);
    	const module = modules[moduleIndex];
    	if (!module) {
    		this.backToLearn();
    	}

    	const { visualState: moduleVisualState } = Progress.getModuleState(module);
    	const lesson = {
    		moduleId,
    		type: 1,
    	};

    	let shortcutQuizzes = [];
    	if (!module.allowShortcut || moduleVisualState != ProgressState.Disabled) {
    		this.backToLearn();
    	}

    	for (let i = 0; i < moduleIndex; i++) {
    		const lessons = modules[i].lessons;

    		for (let j = 0; j < lessons.length; j++) {
    			const lesson = lessons[j];

    			if (lesson.type == 1 && Progress.getLessonState(lesson).visualState != ProgressState.Normal) {
    				const quizzes = lesson.quizzes;

    				for (let k = 0; k < quizzes.length; k++) {
    					shortcutQuizzes.push(quizzes[k]);
    				}
    			}
    		}
    	}

    	shortcutQuizzes.sort(() => 0.5 - Math.random());
    	if (shortcutQuizzes.length >= 10) {
    		shortcutQuizzes = shortcutQuizzes.slice(0, 10);
    	}

    	shortcutQuizzes.map((quiz, index) => quiz.number = index + 1);

    	lesson.quizzes = shortcutQuizzes;

    	this.setState({ shortcutLives: Math.round(30 * lesson.quizzes.length / 100) });

    	this.props.setShortcutLesson(lesson);
    }

    beforeUnload = (e) => {
    	const { t } = this.props;
    	// the method that will be used for both add and remove event
    	const confirmationMessage = t('learn.lesson-test-leave-message');
    	// Gecko + IE
    	(e || window.event).returnValue = confirmationMessage;
    	// Webkit, Safari, Chrome
    	return confirmationMessage;
    }

    async componentWillMount() {
    	window.addEventListener('beforeunload', this.beforeUnload);

    	const {
    		profile,
    		params,
    		courses,
    		isLoaded,
    		loadDefaults,
    		loadCourseInternal,
    		location: { pathName },
    	} = this.props;

    	const { quizNumber, courseName, id } = params;
    	if (!quizNumber) {
    		const newPathName = pathName.endsWith('/') ? `${pathName}1` : `${pathName}/1`;
    		browserHistory.push(newPathName);
    	}

    	if (!isLoaded) {
    		try {
    			await loadDefaults();
    			if (profile.skills.length > 0) {
    				const course = courseName ? courses.find(item => item.alias.toLowerCase() == courseName.toLowerCase()) : null;

    				this.createShortcutLesson(id);
    			}
    		} catch (error) {
    			console.log(error);
    		}
    	} else {
    		this.createShortcutLesson(id);
    	}
    }

    componentWillUnmount() {
    	window.removeEventListener('beforeunload', this.beforeUnload);
    	this.props.setShortcutLesson(null);
    }
}

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'shortcut'),
	defaultsLoaded: defaultsLoaded(state),
	course: state.course,
	courses: state.courses,
	profile: state.userProfile,
	shortcutLesson: state.shortcutLesson,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	loadCourseInternal,
	loadDefaults,
	setShortcutLesson,
}, dispatch);

const translatedShortcut = translate()(Shortcut);

export default connect(mapStateToProps, mapDispatchToProps)(translatedShortcut);
