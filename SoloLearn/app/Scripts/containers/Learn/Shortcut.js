//React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//Service
import Progress, { ProgressState } from '../../api/progress';

//Popups
import Popup from '../../api/popupService';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { loadCourseInternal, setShortcutLesson } from '../../actions/learn';
import { isLoaded, defaultsLoaded } from '../../reducers';

//Additional data and components
import QuizManager from './QuizManager';

//Marterial UI components
import FlatButton from 'material-ui/FlatButton';

class Shortcut extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            shortcutLives: null,
            isShortcutCorrectCounts: 0,
            shortcutPassed: false
        }

        this.exitShortcut = this.exitShortcut.bind(this);
        this.updateShorctutData = this.updateShorctutData.bind(this);
        this.backToLearn = this.backToLearn.bind(this);
    }

    backToLearn() {
        browserHistory.push('/learn/' + this.props.params.courseName);
    }

    render() {
        const that = this;
        const { course, isLoaded, defaultsLoaded } = this.props;

        const faledActions = [
            {
                componentType: FlatButton,
                label: "popupOk",
                primary: true,
                actionCallback: that.backToLearn
            }
        ]

        const successActions = [
            {
                componentType: FlatButton,
                label: "shortcutContinue",
                primary: true,
                actionCallback: that.backToLearn
            }
        ];
     
        if (!isLoaded) {
            return <div>Loading...</div>
        }

        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                updateShorctutData: this.updateShorctutData,
                exitShortcut: this.exitShortcut,
                isShortcut: true,
                shortcutLesson: this.props.shortcutLesson,
                shortcutLives: this.state.shortcutLives,
                isShortcutCorrectCounts: this.state.isShortcutCorrectCounts
            })
        );

        return(
            <div>
                {childrenWithProps}
                { this.state.shortcutLives == 0 && Popup.getPopup(Popup.generatePopupActions(faledActions), this.state.shortcutLives == 0, this.backToLearn, [{key: "shortcutFailed", replacemant: ""}], true) }
                { this.state.shortcutPassed && Popup.getPopup(Popup.generatePopupActions(successActions), this.state.shortcutPassed, this.backToLearn, [{key: "shortcutSucceed", replacemant: ""}], true) }
            </div>
        );
    }

    updateShorctutData(lives, correctCounts) {
        this.setState({
            shortcutLives: lives,
            isShortcutCorrectCounts: correctCounts
        });
    }

    exitShortcut() {
        this.setState({ shortcutPassed: true });
    }

    createShortcutLesson(moduleId) {
        const modules = this.props.course.modules;
        const index = modules.findIndex(module => module.id == moduleId);
        const module = modules[index];

        if(!module) this.backToLearn();

        const moduleState = Progress.getModuleState(module);
        let lesson = {};
        lesson.type = 1;
        lesson.moduleId = moduleId;

        let shortcutQuizzes = [];

        if(!module.allowShortcut || moduleState.visualState != ProgressState.Disabled) this.backToLearn();

        for (let i = 0; i < index; i++) {
            var lessons = modules[i].lessons;

            for (let j = 0; j < lessons.length ; j++) {
                let lesson = lessons[j];

                if (lesson.type == 1 && Progress.getLessonState(lesson).visualState != ProgressState.Normal) {
                    let quizzes = lesson.quizzes;

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

    beforeUnload(e) { // the method that will be used for both add and remove event
        let confirmationMessage = "Are you sure you want to leave the test?";

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage;                            //Webkit, Safari, Chrome
    }

    componentWillMount() {
        window.addEventListener("beforeunload", this.beforeUnload);

        if(!this.props.params.quizNumber) {
            let pathName = this.props.location.pathname;
            let newPathName = pathName.substr(pathName.length - 1) == '/' ? pathName + '1' : pathName + '/1';
            browserHistory.push(newPathName);
        }

        if(!this.props.isLoaded) {
            this.props.loadDefaults().then((response) => {
                if(this.props.profile.skills.length > 0) {
                    let courseName = this.props.params.courseName;
                    let course = courseName ? this.props.courses.find(item => item.alias.toLowerCase() == courseName.toLowerCase()) : null;
                    let courseId = course ? course.id : null;

                    this.props.loadCourseInternal(courseId).then(() => {
                        this.createShortcutLesson(this.props.params.id);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            this.createShortcutLesson(this.props.params.id);
        }
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.beforeUnload);
        this.props.setShortcutLesson(null);
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "shortcut"),
        defaultsLoaded: defaultsLoaded(state),
        course: state.course,
        courses: state.courses,
        profile: state.profile,
        shortcutLesson: state.shortcutLesson
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadCourseInternal: loadCourseInternal,
        loadDefaults: loadDefaults,
        setShortcutLesson: setShortcutLesson
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Shortcut);
