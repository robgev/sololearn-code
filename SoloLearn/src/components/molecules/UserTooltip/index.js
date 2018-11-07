import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'components/atoms';
import UserCard from './UserCard';
import './styles.scss';

const UserTooltip = ({ tooltipContent, userData, ...props }) => (
	<Tooltip
		tooltipContent={
			<UserCard {...userData} />
		}
		{...props}
	/>
);

UserTooltip.propTypes = {
	userData: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		badge: PropTypes.string,
		level: PropTypes.number.isRequired,
		avatarUrl: PropTypes.string,
	}).isRequired,
};

export default UserTooltip;
