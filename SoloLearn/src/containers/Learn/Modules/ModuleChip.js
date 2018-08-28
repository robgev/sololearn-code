import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import Progressbar from 'components/Progressbar';

import 'styles/Learn/ModuleChip.scss';

const ModuleChip = ({
	name,
	onClick,
	className,
	iconSource,
	linkAddress,
	paperClassName,
	completionPercent,
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
					className={`module-circle flex-centered ${paperClassName}`}
				>
					<img className="module-image" alt="" src={iconSource} />
					{completionPercent !== undefined &&
							<Progressbar percentage={completionPercent} />
					}
				</Paper>
				<span className="module-name">{name}</span>
			</Link>
		</div>
	</div>
);

export default ModuleChip;
