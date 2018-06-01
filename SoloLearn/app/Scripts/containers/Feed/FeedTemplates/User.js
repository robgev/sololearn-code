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

	userName: {
		fontSize: '13px',
		margin: '0 0 5px 0',
	},

	level: {
		fontSize: '12px',
		color: '#8BC34A',
	},
};

const DisabledContainer = ({
	children, className, style, onClick,
}) => (
	<div
		style={style}
		tabIndex="0"
		role="button"
		onClick={onClick}
		className={className}
	>
		{children}
	</div>
);

class User extends Component {
	openCoursePopup = () => {
		if (this.props.openPopup) {
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
		const { user, disabled } = this.props;
		const ConditionalContainer = disabled ? DisabledContainer : Link;

		return (
			<ConditionalContainer
				className="user"
				style={styles.user}
				to={`/profile/${user.id}`}
				onClick={this.openCoursePopup}
			>
				<ProfileAvatar
					vertical
					size={60}
					userID={user.id}
					withUserNameBox
					badge={user.badge}
					disabled={disabled}
					userName={user.name}
					avatarUrl={user.avatarUrl}
				/>
			</ConditionalContainer>
		);
	}
}

export default User;
