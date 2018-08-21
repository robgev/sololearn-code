import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Paper from 'material-ui/Paper';

import './OptionsCard.scss';

const OptionsCard = ({
	image, header, info, to, onClick,
}) => (
	<Link
		onClick={onClick !== null
			? (e) => {
				e.preventDefault();
				onClick();
			}
			: () => { }}
		to={to}
	>
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

OptionsCard.defaultProps = {
	onClick: null,
};

OptionsCard.propTypes = {
	image: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired,
	info: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

export default OptionsCard;
