//React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../../actions/defaultActions';
import { getContestsInternal, clearContestsInternal, chooseContestCourse } from '../../../actions/challenges';
import { isLoaded, defaultsLoaded } from '../../../reducers';

//Additional components
import ContestItem from './ContestItem';
import LoadingOverlay from '../../../components/Shared/LoadingOverlay';

//Material UI components
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { List } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

//Utils
import getStyles from '../../../utils/styleConverter';

const styles = {
    contestsWrapper: {
        width: '1000px',
        margin: '15px auto'
    },

    contests: {
        padding: 0
    },

    header: {
        base: {
            backgroundColor: '#e8e8e8',
            padding: '10px'
        },

        title: {        
            fontSize: '14px',
            color: '#777'
        }
    },

    headerWithAction: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 0 0 10px',
        backgroundColor: '#e8e8e8'
    },

    headerButton: {
        marign: '0 5px 0 0'
    },

    newChallengeButton: {
        position: 'fixed',
        bottom: '10px',
        zIndex: 1000,
        right: '50px'
    },

    coursesPopup: {
        width: '40%'
    },

    coursesTitle: {
        fontSize: '20px',
        padding: '24px 24px 10px'
    },

    course: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0'
    },

    courseIcon: {
        width: '40px',
        margin: '0 10px 0 0',
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    
    courseName: {
        margin: '0 0 5px 0'
    }
}

class Contests extends Component {        
    state = {
        selectCourse: false
    }
    componentDidMount() {
        const { defaultsLoaded, isLoaded } = this.props;
    
        if (!defaultsLoaded) {
            this.props.loadDefaults().then((response) => {
                if (!isLoaded) {
                    this.props.getContests();
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        else if (!isLoaded) {
            this.props.getContests();
        }
    }
    handleCoursePopup = (selectCourse) => {
        this.setState({ selectCourse });
    }

    chooseContestCourse = (courseId) => {
        this.props.chooseContestCourse(courseId).then(() => {
            browserHistory.push('/choose-opponent');
        });
    }

    renderContests = (contests) => {
        const courses = this.props.courses;

        return contests.map(contest => {
            const courseName = courses.find(item => item.id == contest.courseID).languageName;
            return (
                <ContestItem
                    key={contest.id}
                    contest={contest}
                    courseName={courseName}
                />
            );
        });
    }

    renderCourses = () => {
        return this.props.courses
            .filter(item => item.isPlayEnabled)
            .map(course => {
                return (
                    <div
                        key={course.id}
                        style={styles.course}
                        onClick={() => { this.chooseContestCourse(course.id) }}
                    >
                        <img
                            src={"https://www.sololearn.com/Icons/Courses/" + course.id + ".png"}
                            alt={course.name}
                            style={styles.courseIcon}
                        />
                        <p style={styles.courseName}>{course.languageName}</p>
                    </div>
                )
            });
    }

    render() {
        const { defaultsLoaded, isLoaded, contests } = this.props;

        if (!defaultsLoaded || !isLoaded) {
            return <LoadingOverlay />;
        }

        const { invited, ongoing, completed } = contests;

        return (
            <Paper id="contests" style={styles.contestsWrapper}>
                {
                    invited.length > 0 &&
                    <div>
                        <p style={getStyles(styles.header.base, styles.header.title)}>INVITED</p>
                        <List style={styles.contests}>{this.renderContests(invited)}</List>
                    </div>
                }
                {
                    ongoing.length > 0 &&
                    <div>
                        <p style={getStyles(styles.header.base, styles.header.title)}>ONGOING</p>
                        <List style={styles.contests}>{this.renderContests(ongoing)}</List>
                    </div>
                }
                {
                    completed.length > 0 &&
                    <div>
                        <div style={styles.headerWithAction}>
                            <p style={styles.header.title}>COMPLETED</p>
                            <FlatButton label="Clear" style={styles.headerButton} onClick={this.props.clearContests} />
                        </div>
                        <List style={styles.contests}>{this.renderContests(completed)}</List>
                    </div>
                }
                <Dialog id="courses"
                    modal={false}
                    open={this.state.selectCourse}
                    title="Choose your weapon"
                    contentStyle={styles.coursesPopup}
                    titleStyle={styles.coursesTitle}
                    //bodyStyle={styles.courses}
                    autoScrollBodyContent
                    onRequestClose={() => this.handleCoursePopup(false)}>
                    {this.renderCourses()}
                </Dialog>
                <FloatingActionButton
                    style={styles.newChallengeButton}
                    secondary
                    zDepth={3}
                    onClick={() => this.handleCoursePopup(true)}>
                    <ContentAdd />
                </FloatingActionButton>
            </Paper>
        );
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state),
        isLoaded: isLoaded(state, "contests"),
        contests: state.challenges.contests,
        courses: state.courses
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDefaults: loadDefaults,
        getContests: getContestsInternal,
        clearContests: clearContestsInternal,
        chooseContestCourse: chooseContestCourse
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Contests);