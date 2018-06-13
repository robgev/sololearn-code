import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Paper } from 'material-ui';

import './OptionsCard.scss';

const OptionsCard = ({
	image, header, info, to,
}) => (
	<Link to={to}>
		<Paper className="options-card">
			<div>
				<img src={image} alt="" />
			</div>
			<div>
				<span>{header}</span>
				<p>{info}</p>
			</div>
		</Paper>
	</Link>
);

OptionsCard.propTypes = {
	image: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired,
	info: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
};

export default OptionsCard;
