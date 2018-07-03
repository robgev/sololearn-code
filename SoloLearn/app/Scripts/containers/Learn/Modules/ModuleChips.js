import React from 'react';
import { toSeoFriendly, EnumNameMapper } from 'utils';
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
	itemType,
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
				<div className={`module-line-container ${alignmentClass}`}>
					<div
						className={`module ${alignmentClass}`}
						key={module.id}
					>
						<Link
							className={`content ${alignmentClass}`}
							to={`/learn/${courseName}/${courseId}/${itemType}/${module.id}/${toSeoFrendly(module.name, 100)}`}
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
				</div>
			);
		})}

	</div>
);

export default ModuleChips;
