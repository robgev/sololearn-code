import React, { Fragment } from 'react';
import { Lock } from 'components/icons';
import { Link, Container, ListItem, HorizontalDivider } from 'components/atoms';
import { ViewStats, Avatar, UserTooltip, LanguageLabel } from 'components/molecules';

import './styles.scss';

const CodeItem = ({ code }) => (
	<Fragment>
		<ListItem className="code-item-wrapper">
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
			<Container className="details-wrapper">
				<Link to={`/playground/${code.publicID}`}>
					{code.name}
				</Link>
				<Container className="stats">
					<LanguageLabel language={code.language} />
					<ViewStats votes={code.votes} comments={code.comments} />
					<Container>
						{!code.isPublic &&
						<Lock />
						}
					</Container>
				</Container>
			</Container>
		</ListItem>
		<HorizontalDivider />
	</Fragment>
);

export default CodeItem;
