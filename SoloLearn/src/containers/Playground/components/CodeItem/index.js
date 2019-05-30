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
	UsernameLink,
	DateInfo,
} from 'components/molecules';
import LanguageCard from 'components/LanguageCard';

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
				<Link to={`/playground/${code.publicID}`} className="language-card">
					<LanguageCard  big language={code.language} />
				</Link>
				<FlexBox fullWidth column className="details-wrapper">
					<Link to={`/playground/${code.publicID}`}>
						<Title>
							{code.name}
						</Title>
					</Link>
					<FlexBox align fullWidth justifyBetween>
						<Container className="stats">
							<ViewStats votes={code.votes} comments={code.comments} />
							{!code.isPublic &&
								<Lock className="code_item-lock" />
							}
						</Container>
						{minimal ?
							<DateInfo date={code.modifiedDate} /> :
							<FlexBox align>
								<FlexBox column justify className="code-item-user-details">
									<Container>
										<UsernameLink className="code-item-user-name" to={`/profile/${user.id}`}>
											{user.name}
										</UsernameLink>
										<ModBadge
											badge={user.badge}
											className="small"
										/>
									</Container>
									<DateInfo date={code.modifiedDate} />
								</FlexBox>
								<ProfileAvatar className="user" user={user} />
							</FlexBox>
						}
					</FlexBox>
				</FlexBox>
			</ListItem>
			<HorizontalDivider />
		</Fragment>
	);
};

export default CodeItem;
