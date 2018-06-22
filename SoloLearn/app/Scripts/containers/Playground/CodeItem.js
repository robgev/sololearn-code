// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Material UI components
import CommentsIcon from 'material-ui/svg-icons/communication/comment';
import Thumbs from 'material-ui/svg-icons/action/thumbs-up-down';
import LockIcon from 'material-ui/svg-icons/action/lock';
import { grey500 } from 'material-ui/styles/colors';

// Utils
import { numberFormatter } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LanguageIcon from 'components/Shared/LanguageIcon';

class CodeItem extends Component {
	shouldComponentUpdate(nextProps) {
		return this.props.code !== nextProps.code;
	}
	render() {
		const { code } = this.props;
		return (
			<div className="code-item-wrapper">
				<div className="author-details">
					<ProfileAvatar
						size={50}
						userID={code.userID}
						userName={code.userName}
						avatarUrl={code.avatarUrl}
						userXP={code.xp}
					/>
				</div>
				<div className="details-wrapper">
					<Link className="code-title" to={`/playground/${code.publicID}`}>
						{code.name}
					</Link>
					<div className="stats">
						<LanguageIcon className="code-language-icon" language={code.language} />
						<div className="votes">
							<Thumbs
								color={grey500}
								className="votes-icon"
								style={{ width: 16, height: 16 }}
							/>
							<span className="votes-text">{code.votes > 0 ? `+${numberFormatter(code.votes)}` : numberFormatter(code.votes)}</span>
						</div>
						<div className="comments">
							<CommentsIcon
								color={grey500}
								className="comments-icon"
								style={{ width: 16, height: 16 }}
							/>
							<span className="comments-text">{code.comments}</span>
						</div>
						<div>
							{ !code.isPublic &&
								<LockIcon
									color={grey500}
									className="lock-icon"
									style={{ width: 16, height: 16 }}
								/>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CodeItem;
