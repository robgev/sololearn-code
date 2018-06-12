import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import texts from 'defaults/texts';
import { toSeoFrendly, EnumNameMapper } from 'utils';
import { AppDefaults } from 'api/service';
import Progress, { ProgressState } from 'api/progress';

const ModuleAlignment = {
	None: 0,
	Center: 1,
	Left: 2,
	Right: 2,
};
EnumNameMapper.apply(ModuleAlignment);

const ModuleChips = ({
	onClick,
	modules,
	courseId,
	courseName,
}) => (
	<div className="modules-chips-container">
		{modules.map((module) => {
			const moduleState = Progress.getModuleState(module);
			const alignmentClass = ModuleAlignment.getName(module.alignment);
			const { stateClass } = moduleState;
			const iconSource =
			`${AppDefaults.downloadHost}Modules/${courseId}/${module.id}${moduleState.visualState === ProgressState.Disabled ? '_disabled' : ''}.png`;

			return (
				[
					!(module.allowShortcut && moduleState.visualState === ProgressState.Disabled) ?
						null :
						<div className="shortcut-content">
							<Link to={`/learn/${courseName}/${module.id}/shortcut/1`}>
								<RaisedButton
									className="shortcut-button"
									label={texts.shortcutButton}
								/>
							</Link>
						</div>,
					<div className={`module-line-container ${alignmentClass}`}>
						<div
							className={`module ${alignmentClass}`}
							key={module.id}
						>
							<Link
								className={`content ${alignmentClass}`}
								to={`/learn/${courseName}/${module.id}/${toSeoFrendly(module.name, 100)}`}
								onClick={e => onClick(e, module.id, moduleState)}
							>
								<Paper
									circle
									zDepth={1}
									key={module.id}
									className={`module-circle ${stateClass}`}
								>
									<img className="module-image" alt={module.name} src={iconSource} />
								</Paper>
								<span className="module-name">{module.name}</span>
							</Link>
						</div>
					</div>,
				]
			);
		})}

	</div>
);

export default ModuleChips;
