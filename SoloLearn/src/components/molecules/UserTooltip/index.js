import React from 'react';
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

export default UserTooltip;
