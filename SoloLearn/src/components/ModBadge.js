import React from 'react';
import 'styles/components/ModBadge.scss';

const ModBadge = ({ badge, className }) => (!badge ? null : (
	<div className={`badge-container ${badge} ${className}`}>
		<div className={`icon ${badge !== 'gold_mod' && badge !== 'platinum_mod' ? 'placeholder' : ''}`}>
			{(badge === 'gold_mod' || badge === 'platinum_mod') &&
				<img src="/assets/mod.png" alt="Mod" />
			}
		</div>
		<span className="mod">Mod</span>
	</div>
));

export default ModBadge;
