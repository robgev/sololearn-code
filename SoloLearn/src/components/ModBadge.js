import React from 'react';
import { determineBadgeColor } from 'utils';
import 'styles/components/ModBadge.scss';

const ModBadge = ({ badge, className }) => {
	const modBadgeColor = determineBadgeColor(badge);
	return !badge ? null : (
		<div style={{ backgroundColor: `${modBadgeColor}` }} className={`badge-container ${badge} ${className}`}>
			<div className={`icon ${badge !== 'gold_mod' && badge !== 'platinum_mod' ? 'placeholder' : ''}`}>
				{(badge === 'gold_mod' || badge === 'platinum_mod') &&
				<img src="/assets/mod.png" alt="Mod" />
				}
			</div>
			<span className="mod">Mod</span>
		</div>
	);
};

export default ModBadge;
