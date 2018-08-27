import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

import 'styles/Learn/ModuleChip.scss'

const ModuleChip = ({
	name,
	onClick,
	className,
	iconSource,
	linkAddress,
	paperClassName,
}) => (
	<div className={`module-line-container ${className}`}>
		<div className={`module ${className}`}>
			<Link
				to={linkAddress}
				onClick={onClick}
				className={`content ${className}`}
			>
				<Paper
					circle
					zDepth={1}
					key={module.id}
					className={`module-circle ${paperClassName}`}
				>
					<img className="module-image" alt='' src={iconSource} />
				</Paper>
				<span className="module-name">{name}</span>
			</Link>
		</div>
	</div>
);

export default ModuleChip;
