// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Material UI components
import Avatar from 'material-ui/Avatar';

// Utils and defaults
import PopupTypes from '../../../defaults/feedPopupTypes';

const styles = {
	user: {
		margin: '0 10px',
		width: '25%',
		textAlign: 'center',
		textDecoration: 'none',
		color: 'inherit',
		position: 'relative',
		zIndex: 2,
	},

	avatar: {
		margin: '0 0 5px 0',
	},

	userName: {
		fontSize: '13px',
		margin: '0 0 5px 0',
	},

	level: {
		fontSize: '12px',
		color: '#8BC34A',
	},
};

class User extends Component {
	constructor(props) {
		super(props);
	}

	openCoursePopup(e) {
		console.log(this.props);

		if (this.props.openPopup) {
			e.stopPropagation();
			e.preventDefault();

			const user = this.props.user;

			const data = {
				type: PopupTypes.profile,
				courseId: this.props.courseId,
				userId: user.id,
				userName: user.name,
				level: user.level,
			};

			this.props.openPopup(data);
		}
	}

	render() {
		const user = this.props.user;

		return (
			<Link to={`/profile/${user.id}`} className="user" style={styles.user} onClick={e => this.openCoursePopup(e)}>
				<Avatar size={45} style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</Avatar>
				<p style={styles.userName}>{user.name}</p>
				<p style={styles.level}>Level {user.level}</p>
			</Link>
		);
	}
}

export default User;
