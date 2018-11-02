// React modules
import React from 'react';
import { Link } from 'react-router';

// Material UI components
import CommentsIcon from 'material-ui/svg-icons/communication/comment';
import Arrows from 'material-ui/svg-icons/action/swap-vert';
import LockIcon from 'material-ui/svg-icons/action/lock';
import { grey500 } from 'material-ui/styles/colors';

// Utils
import { numberFormatter } from 'utils';
import ProfileAvatar from 'components/ProfileAvatar';
import { LanguageLabel } from 'components/molecules';
import UserTooltip from 'components/UserTooltip';

import 'styles/Playground/CodeItem.scss';

const CodeItem = ({ code }) => (
	<div className="code-item-wrapper">
		<div className="author-details">
			<UserTooltip userData={code}>
				<ProfileAvatar
					size={50}
					level={code.level}
					userID={code.userID}
					userName={code.userName}
					avatarUrl={code.avatarUrl}
					avatarStyle={{ marginRight: 10 }}
				/>
			</UserTooltip>
		</div>
		<div className="details-wrapper">
			<Link className="code-title hoverable" to={`/playground/${code.publicID}`}>
				{code.name}
			</Link>
			<div className="stats">
				<LanguageLabel className="code-language-icon" language={code.language} />
				<div className="votes">
					<Arrows
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
					{!code.isPublic &&
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

export default CodeItem;
