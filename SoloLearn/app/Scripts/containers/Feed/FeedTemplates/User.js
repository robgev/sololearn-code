// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Utils and defaults
import PopupTypes from 'defaults/feedPopupTypes';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

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
	openCoursePopup(e) {
		if (this.props.openPopup) {
			e.stopPropagation();
			e.preventDefault();

			const { user } = this.props;

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
		const { user } = this.props;

		return (
			<Link to={`/profile/${user.id}`} className="user" style={styles.user} onClick={e => this.openCoursePopup(e)}>
				<ProfileAvatar
					size={45}
					vertical
					withUserNameBox
					style={styles.avatar}
					userID={user.id}
					userName={user.name}
					avatarUrl={user.avatarUrl}
				/>
				<p style={styles.level}>Level {user.level}</p>
			</Link>
		);
	}
}

export default User;
