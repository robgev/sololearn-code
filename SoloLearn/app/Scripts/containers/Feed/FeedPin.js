// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

// Utils
import { getLanguageColor } from 'utils';

// Additional data and components
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
import User from './FeedTemplates/User';

const styles = {
	feedPinWrapper: {
		position: 'relative',
		margin: '10px 0',
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
	},

	heading: {
		padding: '7px 7px 5px 7px',
	},

	title: {
		fontWeight: '500',
		fontSize: '16px',
	},

	subTitle: {
		fontSize: '13px',
		color: '#777',
		paddingLeft: 5,
	},

	pinImage: {
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
				<p style={styles.codeName}>{code.name}</p>
			</Link>
		));
	}

	// Render pin posts
	generatePosts() {
		const { pin } = this.props;

		return pin.posts.map(post => (
			<Post noVotes key={`pinPost ${post.id} ${pin.id}`} post={post} isQuestion />
		));
	}

	getPinUrl() {
		const { pin } = this.props;
		let url = pin.action;

		if (pin.action == null || pin.action === '') {
			if (pin.courses) {
				const firstCourse = pin.courses[0];
				url = `/learn/${firstCourse.alias}`;
			} else if (pin.users) {
				const firstUser = pin.users[0];
				url = `/profile/${firstUser.id}`;
			} else if (pin.codes) {
				const firstCode = pin.codes[0];
				url = `/playground/${firstCode.publicID}`;
			} else if (pin.posts) {
				const firstPost = pin.posts[0];
				url = `/discuss/${firstPost.id}`;
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
						<p className="sub-title" style={styles.subTitle}>{pin.message}</p>
					</div>
					{pin.imageUrl &&
						<img
							alt="Pinned item"
							style={styles.pinImage}
							src="../../../assets/kaleid.jpg"
						/>
					}
					{pin.courses && <div className="courses" style={styles.courses}>{this.generateCourses()}</div>}
					{pin.users && <div className="users" style={styles.users}>{this.generateUsers()}</div>}
					{pin.codes && <div className="codes" style={styles.codes}>{this.generateCodes()}</div>}
					{pin.posts && <div className="posts" style={styles.posts}>{this.generatePosts()}</div>}
					{
						(pin.actionName && pin.actionName !== '') &&
						<Link to={this.getPinUrl()} className="actions" style={styles.actions}>
							<FlatButton label={pin.actionName} primary style={styles.pinButton} />
						</Link>
					}
				</Paper>
				<Link className="feed-pin" to={this.getPinUrl()} style={styles.linkStyle} />
			</div>
		);
	}

	shouldComponentUpdate(nextProps) {
		return this.props.pin !== nextProps.pin;
	}
}

export default Radium(FeedPin);
