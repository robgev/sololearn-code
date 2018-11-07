import React from 'react';
import { translate } from 'react-i18next';

import AvatarColors from 'constants/AvatarColors';
import { Container, SecondaryTextBlock, Image } from 'components/atoms';
import { RaisedButton, UsernameLink, ContainerLink } from 'components/molecules';
import ModBadge from 'components/ModBadge';
import { numberFormatter, determineBadge } from 'utils';

const UserCard = ({
	t,
	id,
	level,
	name,
	badge,
	avatarUrl,
}) => {
	const { modBadge } = determineBadge(badge);
	return (
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
				<UsernameLink>
					{name}
					<ModBadge
						badge={modBadge}
						className="small"
					/>
				</UsernameLink>
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
};

export default translate()(UserCard);