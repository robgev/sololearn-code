import React, { Fragment } from 'react';
import { Lock } from 'components/icons';
import { Link, Title, Container, ListItem, HorizontalDivider } from 'components/atoms';
import { ViewStats, ProfileAvatar, UserTooltip, LanguageLabel } from 'components/molecules';

import './styles.scss';

const CodeItem = ({ code }) => (
	<Fragment>
		<ListItem className="code-item-wrapper">
			<UserTooltip userData={code}>
				<ProfileAvatar user={code} />
			</UserTooltip>
			<Container className="details-wrapper">
				<Link to={`/playground/${code.publicID}`}>
					<Title>
						{code.name}
					</Title>
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
