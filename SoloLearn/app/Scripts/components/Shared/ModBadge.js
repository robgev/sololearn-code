import React from 'react';
import { determineBadgeColor } from 'utils';
import 'styles/components/Shared/ModBadge.scss';

const ModBadge = ({ badge, className }) => {
	const modBadgeColor = determineBadgeColor(badge);
	return !badge ? null : (
		<div style={{ backgroundColor: `${modBadgeColor}` }} className={`badge-container ${badge} ${className}`}>
			{(badge === 'gold_mod' || badge === 'platinum_mod') && <span className="icon">KING </span>}
			Mod
		</div>
	);
};

export default ModBadge;
