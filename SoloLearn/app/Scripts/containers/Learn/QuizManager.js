//React modules
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isLoaded } from '../../reducers';
import { loadDefaults } from '../../actions/defaultActions';
import { loadCourseInternal, selectLesson, selectModule, selectQuiz } from '../../actions/learn';

//Service
import Service from '../../api/service';
import Progress, { ProgressState } from '../../api/progress';

//Additional data and components
import Comments from '../Comments/CommentsBase';

//Material UI components
import {Tabs, Tab} from 'material-ui/Tabs';

//Utils
import toSeoFrendly from '../../utils/linkPrettify';

export const LessonType = {
    Checkpoint: 0,
    Quiz: 1
};

class QuizManager extends Component {
    state = {
        commentsOpened: false
    }
    generateTimeline = (quizzes, activeQuiz) => {
        let timeline = [];
        const lesson = !this.props.isShortcut ? this.props.activeLesson : this.props.shortcutLesson;
        let progress = Progress.getLessonProgress(lesson.id);
        let activeQuizIndex = 0;
        let isLessonCompleted = false;

        if (progress != null) {
            isLessonCompleted = progress.isCompleted || false;
            let incrementQuzId = false;
            for (var i = 0; i < progress.quizzes.length; i++) {
                if (progress.quizzes[i].isCompleted) {
                    activeQuizIndex = i;
                    incrementQuzId = true;
                }
            }
            if (incrementQuzId) {
                activeQuizIndex++;
            }
        }

        const progressState = ProgressState;
        const isCheckpoint = lesson.type == LessonType.Checkpoint;
        //let currentIndex = 0;

        quizzes.map((quiz, index) => {
            let isCompleted = (isLessonCompleted || index <= activeQuizIndex) && !this.props.isShortcut;
            var isCurrent = quizzes[index].id == activeQuiz.id;
            //if (isCurrent) currentIndex = (isCheckpoint ? index * 2 : index);

            if (isCheckpoint) {
                timeline.push({
                    lessonId: lesson.id,
                    quizId: quiz.id,
                    key: "text" + quiz.id,
                    isText: true,
                    index: index,
                    number: (index * 2) + 1,
                    state: (isCurrent ? progressState.Active : isCompleted ? progressState.Normal : progressState.Disabled)
                });
            }
            timeline.push({
                lessonId: lesson.id,
                quizId: quiz.id,
                key: "quiz" + quiz.id,
                isText: false,
                index: index,
                number: isCheckpoint ? (index + 1) * 2 : index + 1,
                state: (isCurrent ? progressState.Active : isCompleted ? progressState.Normal : progressState.Disabled)
            });
        });

        return timeline.map((item, index) => {
            return (
                <Tab value={index} label={item.quizId} key={item.key} onClick={() => this.loadLessonLink(item.quizId, item.number, item.isText, item.state)} className={ProgressState.getName(item.state) + " timeline-item"}></Tab>
            );
        });

    }

    loadLessonLink = (quizId, number, isText, state) => {
        if (state == ProgressState.Disabled) {
            this.setState(this.state);
            return;
        }

        this.props.selectQuiz(Object.assign({}, { id: quizId }, { number: number }, { isText: isText }));

        if(this.props.isShortcut) {
            let pathName = this.props.location.pathname;
            let newPathName = pathName.substr(0, pathName.length - 1) + number;
            browserHistory.push(newPathName);
        }
        else {
            const lesson = this.props.activeLesson;
            browserHistory.push('/learn/' + this.props.params.courseName + "/" + this.props.params.moduleId + '/' + this.props.params.moduleName + '/' + lesson.id + '/' + toSeoFrendly(lesson.name, 100) + '/' + number);
        }
    }

    getActiveQuiz = (lesson) => {
        const quizzes = lesson.quizzes;
        const currentNumber = this.props.params.quizNumber;
        let activeQuiz = {};
        const isCheckpoint = lesson.type == LessonType.Checkpoint;
        for (let i = 0; i < quizzes.length; i++) { 
            if (isCheckpoint) {
                if((i * 2) + 1 == currentNumber) {
                    Object.assign(activeQuiz, { id: quizzes[i].id }, { number: currentNumber }, { isText: true });
                }
            }
            if((isCheckpoint ? (i + 1) * 2 : i + 1) == currentNumber) {
                Object.assign(activeQuiz, { id: quizzes[i].id }, { number: currentNumber }, { isText: false });
            }
        }

        this.props.selectQuiz(activeQuiz);
    }

    openComments = () => {
        this.setState({ commentsOpened: true });
    }

    closeComments = () => {
        this.setState({ commentsOpened: false });
    }

    render() {    
        const { isLoaded, activeLesson, activeQuiz } = this.props;

        if ((!isLoaded && !this.props.isShortcut) || (this.props.isShortcut && !activeQuiz)) {
            return <div>Loading...</div>;
        }

        const quizzes = !this.props.isShortcut ? activeLesson.quizzes : this.props.shortcutLesson.quizzes;

        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                loadLessonLink: this.loadLessonLink,
                openComments: this.openComments,
                updateShorctutData: this.props.updateShorctutData,
                exitShortcut: this.props.exitShortcut,
                isShortcut: this.props.isShortcut,
                shortcutLesson: this.props.shortcutLesson,
                shortcutLives: this.props.shortcutLives,
                isShortcutCorrectCounts: this.props.isShortcutCorrectCounts
            })
        );

        return (
            <div className="quizOverlay">
                <Tabs className="quizTimeline" initialSelectedIndex={parseInt(this.props.activeQuiz.number) - 1} value={this.props.activeQuiz.number - 1}>
                    {this.generateTimeline(quizzes, activeQuiz)}
                </Tabs>
                {childrenWithProps}
                {(!this.props.isShortcut && this.state.commentsOpened) && <Comments commentsOpened={this.state.commentsOpened} closeComments={this.closeComments} id={activeQuiz.id} type={activeQuiz.isText ? 1 : 3} commentsType={"lesson"} />}
            </div>
        );
    }

    componentWillMount() {
        if(!this.props.isLoaded && !this.props.isShortcut) {
            this.props.loadCourseInternal().then(() => {
                this.props.selectModule(parseInt(this.props.params.moduleId));
                this.props.selectLesson(parseInt(this.props.params.lessonId));

                const lesson = this.props.lessons[this.props.params.lessonId];
                this.getActiveQuiz(lesson);
            }).catch((error) => {
                console.log(error);
            });
        }
        else if(this.props.isShortcut) {
            const activeQuiz = this.props.shortcutLesson.quizzes[0];
            this.props.selectQuiz(Object.assign({}, { id: activeQuiz.id }, { number: activeQuiz.number }, { isText: false }));
        }
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "quizzes"),
        course: state.course,
        lessons: state.lessonsMapping,
        activeQuiz: state.activeQuiz,
        activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
        activeLesson: !state.course ? null : state.lessonsMapping[state.activeLessonId]
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDefaults,
        loadCourseInternal,
        selectLesson,
        selectModule,
        selectQuiz
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizManager);