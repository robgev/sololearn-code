import React, { Fragment } from 'react';
import { Lock } from 'components/icons';
import {
	FlexBox,
	Link,
	Title,
	Container,
	ListItem,
	HorizontalDivider,
} from 'components/atoms';
import {
	ViewStats,
	ModBadge,
	ProfileAvatar,
	LanguageLabel,
	UsernameLink,
	DateInfo,
} from 'components/molecules';

import './styles.scss';

const CodeItem = ({ code, minimal }) => {
	const user = {
		id: code.userID,
		name: code.userName,
		badge: code.badge,
		level: code.level,
		avatarUrl: code.avatarUrl,
	};
	return (
		<Fragment>
			<ListItem className="code-item-wrapper">
				<ProfileAvatar className="user" user={user} />
				<FlexBox fullWidth column className="details-wrapper">
					<Link to={`/playground/${code.publicID}`}>
						<Title>
							{code.name}
						</Title>
					</Link>
					{!minimal &&
						<Container>
							<UsernameLink to={`/profile/${user.id}`}>
								{user.name}
							</UsernameLink>
							<ModBadge
								badge={user.badge}
								className="small"
							/>
						</Container>
					}
					<Container className="stats">
						<LanguageLabel language={code.language} />
						<ViewStats votes={code.votes} comments={code.comments} />
						<Container>
							{!code.isPublic &&
							<Lock className="code_item-lock" />
							}
						</Container>
						{!minimal &&
							<Container>
								<DateInfo date={code.modifiedDate} />
							</Container>
						}
					</Container>
				</FlexBox>
			</ListItem>
			<HorizontalDivider />
		</Fragment>
	);
};

export default CodeItem;
