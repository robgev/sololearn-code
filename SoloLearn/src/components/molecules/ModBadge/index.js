import React from 'react';
import PropTypes from 'prop-types';
import { Image, Label } from 'components/atoms';
// Container, ModBadgeIcon
import { determineBadge } from 'utils';
import './styles.scss';

const ModBadge = ({
	big, badge, className, ...props
}) => {
	const { modBadge } = determineBadge(badge);
	// const hasCrown = modBadge === 'gold_mod' || modBadge === 'platinum_mod';
	// Should show crown icon;
	return !modBadge ? null : (
		<Label
			{...props}
			className={`molecule_mod-badge-container ${modBadge} ${big ? 'big' : 'small'} ${className}`}
		>
			<Image src={`/assets/${modBadge}.png`} />
		</Label>
		// 	{hasCrown &&
		// 		<ModBadgeIcon />
		// 	}
		// 	<Container className="molecule_mod-badge-label">Mod</Container>
	);
};

ModBadge.propTypes = {
	big: PropTypes.bool,
	className: PropTypes.string,
	badge: PropTypes.string.isRequired,
};

ModBadge.defaultProps = {
	big: false,
	className: '',
};

export default ModBadge;
