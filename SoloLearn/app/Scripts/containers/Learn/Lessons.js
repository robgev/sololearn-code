//React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { loadCourseInternal, selectLesson, selectModule, selectQuiz } from '../../actions/learn';
import { isLoaded } from '../../reducers';

//Marterial UI components
import Paper from 'material-ui/Paper';
import Progress, { ProgressState } from '../../api/progress';

//Utils
import toSeoFrendly from '../../utils/linkPrettify';
import getStyles from '../../utils/styleConverter';

const styles = {
    lessons: {
        width: '1000px',
        margin: '0 auto',
        textAlign: 'center'
    },

    lessonWrapper: {
        display: 'inline-block',
        margin: '20px 0 0 0'
    },

    lesson: {
        base: {
            position: 'relative',
            display: 'inline-block',
            height: '155px',
            width: '155px',
            overflow: 'hidden',
            margin: '4px'
        },

        disabled: {
            backgroundColor: '#e4e4e4'
        }
    },

    lessonNumber: {
        padding: '4px',
        fontSize: '12px',
        float: 'right',
        color: '#777'
    },

    lessonName: {
        padding: '20px 10px',
        textAlign: 'left',
        height: '115px',
        color: '#565656',
        fontSize: '15px'
    },

    lessonInfo: {
        base: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '10px',
            fontSize: '14px',
            textAlign: 'left'
        },

        active: {
            backgroundColor: '#607d8b',
            color: '#fff'
        },

        normal: {
            backgroundColor: '#8bc34a',
            color: '#fff'
        },

        disabled: {
            backgroundColor: 'inherit',
            color: '#565656'
        }
    }
}

class Lessons extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    renderLessons() {
        const lessons = this.props.activeModule.lessons;

        return lessons.map((lesson, index) => {
            const lessonState = Progress.getLessonState(lesson);

            return (
                <Link to={"/learn/" + this.props.params.courseName + "/" + this.props.params.moduleId + "/" + this.props.params.moduleName + "/" + lesson.id + "/" + toSeoFrendly(lesson.name, 100) + "/" + lessonState.activeQuizNumber} 
                        key={lesson.id} className={"lesson-item " + lessonState.stateClass} style={styles.lessonWrapper}
                        onClick={(e) => this.handleClick(e, lesson.id, lessonState)} >
                    <Paper zDepth={lessonState.visualState == ProgressState.Disabled ? 0 : 1} key={lesson.id} style={lessonState.visualState == ProgressState.Disabled ? getStyles(styles.lesson.base, styles.lesson.disabled) : styles.lesson.base}>
                        <div className="number" style={styles.lessonNumber}>{(index + 1) + '/' + lessons.length}</div>
                        <div className="name" style={styles.lessonName}>{lesson.name}</div>
                        <div className="info" style={[styles.lessonInfo.base, styles.lessonInfo[lessonState.stateClass]] }>
                            <span>{lesson.quizzes.length} questions</span>
                        </div>
                    </Paper>
                </Link>
            );
        });
    }

    handleClick(e, lessonId, lessonState) {
        if (lessonState.visualState == ProgressState.Disabled) {
            e.preventDefault();
            return;
        }
        this.props.selectLesson(lessonId, lessonState);
    }

    render() {
        const { course, modules, activeModule, isLoaded } = this.props;

        if (!isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <div className="lessons" style={styles.lessons}>
                {this.renderLessons()}
            </div>
        );
    }

    componentWillMount() {
        if(!this.props.isLoaded) {
            this.props.loadDefaults().then(() => {
                this.props.loadCourseInternal().then(() => {           
                    this.props.selectModule(parseInt(this.props.params.moduleId));
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });;
        }
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "lessons"),
        course: state.course,
        modules: state.modulesMapping,
        activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId]
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadCourseInternal: loadCourseInternal,
        selectLesson: selectLesson,
        selectModule: selectModule,
        selectQuiz: selectQuiz,
        loadDefaults: loadDefaults
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Lessons));