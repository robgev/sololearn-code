import React from 'react';
import PropTypes from 'prop-types';
import { Container, SecondaryTextBlock } from 'components/atoms';
import { Avatar, UsernameLink } from 'components/molecules';

import './styles.scss';

const UserCard = ({ className, user, t, ...props }) => {
	const {
		id,
		name,
		avatarUrl,
		followers,
		level,
	} = user;
	return (
		<Container className="user-card-container" >
			<Avatar
				disabled
				userID={id}
				userName={name}
				avatarUrl={avatarUrl}
				className='avatar'
				variant='medium'
			/>
			<Container className='info'>
				<Container>
					<UsernameLink to={`/profile/${id}`}> {name} </UsernameLink>
				</Container>
				<Container>
					<SecondaryTextBlock>{ followers } {t('common.user-followers')} | {t('common.user-level')} { level }</SecondaryTextBlock>
				</Container>
			</Container>
		</Container>
	)

}

UserCard.propTypes = {
	t: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
}

UserCard.defaultProps = {
	className: '',
};
export default UserCard;