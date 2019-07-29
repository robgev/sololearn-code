import React, { Fragment } from 'react';
import { Lock } from 'components/icons';
import {
	FlexBox,
	Link,
	Title,
	Container,
	ListItem,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	ViewStats,
	ModBadge,
	ProfileAvatar,
	UsernameLink,
} from 'components/molecules';
import LanguageCard from 'components/LanguageCard';
import { updateDate } from 'utils';

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
					<LanguageCard big language={code.language} />
				</Link>
				<FlexBox justifyBetween className="code-item_details-container">
					<FlexBox fullWidth column className="details-wrapper">
						<Link to={`/playground/${code.publicID}`}>
							<Title className="title">
								{code.name}
							</Title>
						</Link>

						<Container className="stats">
							<ViewStats
								votes={code.votes}
								comments={code.comments}
								views={!minimal ? code.viewCount : undefined}
							/>
							{!code.isPublic &&
								<Lock className="code_item-lock" />
							}
						</Container>
					</FlexBox>

					{minimal ?
						<SecondaryTextBlock>{updateDate(code.modifiedDate)}</SecondaryTextBlock> :
						<FlexBox fullWidth justifyEnd className="code-item-secondary-details">
							<FlexBox align>
								<FlexBox column alignEnd className="code-item-user-details">
									<FlexBox >
										<UsernameLink to={`/profile/${user.id}`} className="code-item-user-name">
											{user.name}
										</UsernameLink>
										<ModBadge
											badge={user.badge}
											className="code-item-mod-badge"
										/>
									</FlexBox>

									{!minimal &&
										<SecondaryTextBlock>{updateDate(code.modifiedDate)}</SecondaryTextBlock>
									}
								</FlexBox>
								<ProfileAvatar size="extra-small" user={user} />
							</FlexBox>
						</FlexBox>
					}
				</FlexBox>
			</ListItem>

		</Fragment>
	);
};

export default CodeItem;
