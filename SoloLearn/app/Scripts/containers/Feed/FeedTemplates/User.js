// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Utils and defaults
import PopupTypes from 'defaults/feedPopupTypes';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import 'styles/Feed/FeedTemplates/User.scss';

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
		const { id, user, disabled } = this.props;
		const ConditionalContainer = disabled ? DisabledContainer : Link;

		return (
			<ConditionalContainer
				to={`/profile/${user.id}`}
				className="challenge-user"
				onClick={this.openCoursePopup}
			>
				<ProfileAvatar
					vertical
					size={60}
					withTooltip
					level={user.level}
					userID={user.id}
					withUserNameBox
					disabled={disabled}
					userName={user.name}
					avatarUrl={user.avatarUrl}
					tooltipId={`challenge-user-${id}`}
				/>
			</ConditionalContainer>
		);
	}
}

export default User;
