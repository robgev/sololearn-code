// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

// Utils
import { getLanguageColor } from 'utils';
import PopupTypes from 'defaults/feedPopupTypes';
import CourseCard from 'components/CourseCard';

// Additional data and components
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
import User from './FeedTemplates/User';

const styles = {
	feedPinWrapper: {
		position: 'relative',
		marginBottom: 10,
	},

	linkStyle: {
		display: 'block',
		textDecoration: 'none',
		color: '#000',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 1,
		cursor: 'pointer',
	},

	heading: {
		padding: '15px 20px 10px 20px',
	},

	title: {
		fontWeight: '500',
		marginBottom: 5,
		fontSize: '18px',
	},

	subTitle: {
		fontSize: '14px',
		color: '#777',
	},

	pinImage: {
		display: 'block',
		width: '100%',
	},

	courses: {
		padding: '7px',
	},

	users: {
		display: 'flex',
		textAlign: 'center',
		justifyContent: 'center',
		padding: '7px',
	},

	codes: {
		boxSizing: 'border-box',
		width: '100%',
		textAlign: 'center',
		padding: '7px',
	},

	code: {
		display: 'flex',
		alignItems: 'center',
		padding: '7px',
		backgroundColor: '#eee',
		margin: '0 0 5px 0',
		position: 'relative',
		zIndex: 2,
		textDecoration: 'none',
	},

	languageIcon: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '30px',
		height: '30px',
		fontSize: '12px',
		color: '#fff',
		margin: '0px 10px 0 0',
	},

	codeName: {
		fontSize: '13px',
		color: '#777',
	},

	codeAuthor: {
		fontSize: '12px',
		color: '#888',
	},

	codeInfo: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},

	posts: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		textAlign: 'center',
		padding: '7px',
	},

	actions: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '5px',
	},

	pinButton: {
		zIndex: 2,
	},
};

class FeedPin extends Component {
	// Render pin courses
	generateCourses() {
		const { pin } = this.props;

		return pin.courses.map(course => (
			<Course key={`pinCourse ${course.id} ${pin.id}`} course={course} openPopup={this.props.openPopup} />
		));
	}

	// Render pin users
	generateUsers() {
		const { pin } = this.props;

		return pin.users.map(user => (
			<User key={`pinUser ${user.id} ${pin.id}`} user={user} />
		));
	}

	// Render pin codes
	generateCodes() {
		const { pin } = this.props;

		return pin.codes.map(code => (
			<Link to={`/playground/${code.publicID}`} className="code" style={styles.code} key={`pinCode ${code.id} ${pin.id}`}>
				<div className="language" style={[ styles.languageIcon, { backgroundColor: getLanguageColor(code.language) } ]}>{code.language}</div>
				<div style={styles.codeInfo}>
					<p style={styles.codeName}>{code.name}</p>
					<p style={styles.codeAuthor}>{code.userName}</p>

				</div>
			</Link>
		));
	}

	// Render pin posts
	generatePosts() {
		const { pin } = this.props;

		return pin.posts.map(post => (
			<Post containerStyle={{ display: 'flex', width: '100%' }} noVotes key={`pinPost ${post.id} ${pin.id}`} post={post} isQuestion />
		));
	}

	generateLessons() {
		const { pin } = this.props;

		return pin.lessons.map(lesson => (
			<CourseCard
				small
				{...lesson}
				key={lesson.name}
				style={{
					padding: 15,
					marginBottom: 0,
					paddingBottom: 0,
					boxShadow: 'none',
				}}
			/>
		));
	}

	openCoursePopup = () => {
		const { pin } = this.props;
		const firstCourse = pin.courses[0];
		const data = {
			type: PopupTypes.course,
			courseId: firstCourse.id,
			courseName: firstCourse.name,
		};
		this.props.openPopup(data);
	}

	getPinUrl() {
		const { pin } = this.props;
		let url = pin.action;

		if (pin.action == null || pin.action === '') {
			if (pin.users) {
				const firstUser = pin.users[0];
				url = `/profile/${firstUser.id}`;
			} else if (pin.codes) {
				const firstCode = pin.codes[0];
				url = `/playground/${firstCode.publicID}`;
			} else if (pin.posts) {
				const firstPost = pin.posts[0];
				url = `/discuss/${firstPost.id}`;
			} else if (pin.lessons) {
				const firstLesson = pin.lessons[0];
				url = `/learn/lesson/${firstLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${firstLesson.id}/1`;
			} else if (pin.userPosts) {
				const firstPost = pin.userPosts[0];
				url = `/userPost/${firstPost.id}`;
			}
		} else {
			const parts = url.split('/');
			const primaryPart = parts[1];

			switch (primaryPart) {
			case 'tab':
				if (parts.length < 3) return ''; // check
				switch (parts[2]) {
				case 'learn':
					url = '/learn';
					break;
				case 'play':
					url = '/play';
					break;
				case 'code':
					url = '/codes';
					break;
				case 'discuss':
					url = '/discuss';
					break;
				default:
					break;
				}
				break;
			case 'profile':
				url = '/profile';

				if (parts.length > 2) {
					switch (parts[2]) {
					case 'code':
						url = '/profile/codes';
						break;
					case 'discuss':
						url = '/profile/discuss';
						break;
					case 'skills':
						url = '/profile/skills';
						break;
					case 'badges':
						url = '/profile/badges';
						break;
					default:
						break;
					}
				}
				break;
				// Leader Board
			case 'settings':
				url = '/settings';
				break;
			case 'invite':
				url = '/invite';
				break;
			case 'connect':
				url = '/connect';
				break;
			case 'quiz-factory':
				url = '/quiz-factory';
				break;
			case 'collection':
				url = `/learn/more/${parts[2]}`;
				break;
			default:
				break;
			}
		}

		return url;
	}

	render() {
		const { pin } = this.props;

		return (
			<div className="feed-pin-wrapper" style={styles.feedPinWrapper}>
				<Paper className="feed-pin-content">
					<div className="heading" style={styles.heading}>
						<p className="title" style={styles.title}>{pin.title}</p>
						<p style={styles.subTitle}>{pin.message}</p>
					</div>
					{pin.imageUrl &&
						<img
							alt="Pinned item"
							style={styles.pinImage}
							src={pin.imageUrl}
						/>
					}
					{pin.courses && <div className="courses" style={styles.courses}>{this.generateCourses()}</div>}
					{pin.users && <div className="users" style={styles.users}>{this.generateUsers()}</div>}
					{pin.codes && <div className="codes" style={styles.codes}>{this.generateCodes()}</div>}
					{pin.lessons && <div className="lessons" style={styles.lessons}>{this.generateLessons()}</div>}
					{pin.posts && <div className="posts" style={styles.posts}>{this.generatePosts()}</div>}
					{
						(pin.actionName && pin.actionName !== '') &&
						pin.courses ?
							<div style={styles.actions}>
								<FlatButton
									primary
									label={pin.actionName}
									style={styles.pinButton}
									onClick={this.openCoursePopup}
								/>
							</div> :
							<Link to={this.getPinUrl()} className="actions" style={styles.actions}>
								<FlatButton label={pin.actionName} primary style={styles.pinButton} />
							</Link>
					}
				</Paper>
				{pin.courses ?
					<span className="feed-pin" onClick={this.openCoursePopup} style={styles.linkStyle} /> :
					<Link className="feed-pin" to={this.getPinUrl()} style={styles.linkStyle} />
				}
			</div>
		);
	}
}

export default Radium(FeedPin);
