import React from 'react';
import { translate } from 'react-i18next';

import AvatarColors from 'constants/AvatarColors';
import { Container, SecondaryTextBlock, Image } from 'components/atoms';
import { RaisedButton, UsernameLink, ContainerLink, ModBadge } from 'components/molecules';
//import ModBadge from 'components/ModBadge';
import { numberFormatter } from 'utils';

const UserCard = ({
	t,
	id,
	level,
	name,
	badge,
	avatarUrl,
}) => (
	<ContainerLink to={`/profile/${id}`} className="molecule_userTooltip-container">
		{avatarUrl
			? <Image src={avatarUrl} alt="avatar" className="molecule_userTooltip-avatar" />
			: (
				<Container
					className="molecule_userTooltip-avatar molecule_userTooltip-letter"
					style={{ backgroundColor: AvatarColors[id % AvatarColors.length] }}
				>
					{name.toUpperCase().charAt(0)}
				</Container>
			)
		}
		<Container className="molecule_userTooltip-user-data">
			<Container>
				<UsernameLink>
					{name}
				</UsernameLink>
				<ModBadge
					badge={badge}
					className="small"
				/>
			</Container>
			{level !== null &&
			<SecondaryTextBlock>
				{t('common.user-level')} {numberFormatter(level)}
			</SecondaryTextBlock>
			}
			<RaisedButton>
				<ContainerLink className="molecule_userTooltip-profile-link-button" to={`/profile/${id}`}>{t('profile.show-profile')}</ContainerLink>
			</RaisedButton>
		</Container>
	</ContainerLink>
);

export default translate()(UserCard);
