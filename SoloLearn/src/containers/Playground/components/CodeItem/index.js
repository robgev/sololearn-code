// React modules
import React from 'react';

// Material UI components
import { numberFormatter } from 'utils';
import { Container, SecondaryTextBlock } from 'components/atoms';
import { Arrows, Comment, Lock } from 'components/icons';
import { TextLink, Avatar, UserTooltip, LanguageLabel } from 'components/molecules';

import './styles.scss';

const CodeItem = ({ code }) => (
	<Container className="code-item-wrapper">
		<Container className="author-details">
			<UserTooltip userData={code}>
				<Avatar
					size={50}
					level={code.level}
					userID={code.userID}
					userName={code.userName}
					avatarUrl={code.avatarUrl}
					avatarStyle={{ marginRight: 10 }}
				/>
			</UserTooltip>
		</Container>
		<Container className="details-wrapper">
			<TextLink className="code-title hoverable" to={`/playground/${code.publicID}`}>
				{code.name}
			</TextLink>
			<Container className="stats">
				<LanguageLabel className="code-language-icon" language={code.language} />
				<Container className="votes">
					<Arrows
						className="votes-icon"
						style={{ width: 16, height: 16 }}
					/>
					<SecondaryTextBlock className="votes-text">{code.votes > 0 ? `+${numberFormatter(code.votes)}` : numberFormatter(code.votes)}</SecondaryTextBlock>
				</Container>
				<Container className="comments">
					<Comment
						className="comments-icon"
						style={{ width: 16, height: 16 }}
					/>
					<SecondaryTextBlock className="comments-text">{code.comments}</SecondaryTextBlock>
				</Container>
				<Container>
					{!code.isPublic &&
						<Lock
							className="lock-icon"
							style={{ width: 16, height: 16 }}
						/>
					}
				</Container>
			</Container>
		</Container>
	</Container>
);

export default CodeItem;
