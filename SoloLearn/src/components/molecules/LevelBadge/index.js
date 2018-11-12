import React from 'react';
import PropTypes from 'prop-types';
import { RoundImage } from 'components/molecules';
import { determineBadge } from 'utils';
import './styles.scss';

// NOTE: Specify position: relative on parent

const LevelBadge = ({
	profile, badge, className, ...props
}) => {
	const { levelBadge } = determineBadge(badge);
	return (
		<RoundImage
			alt="LB"
			className={`molecule_level-badge ${className}`}
			{...props}
			src={`/assets/badge_${levelBadge}${profile ? '_profile' : ''}.png`}
		/>
	);
};

LevelBadge.propTypes = {
	profile: PropTypes.bool,
	className: PropTypes.string,
	badge: PropTypes.string.isRequired,
};

LevelBadge.defaultProps = {
	className: '',
	profile: false,
};

export default LevelBadge;
