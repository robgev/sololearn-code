import React from 'react';
import { toSeoFriendly, EnumNameMapper } from 'utils';
import { AppDefaults } from 'api/service';
import Progress, { ProgressState } from 'api/progress';

import ModuleChip from './ModuleChip';

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
				<ModuleChip
					key={module.id}
					name={module.name}
					iconSource={iconSource}
					className={alignmentClass}
					paperClassName={stateClass}
					onClick={e => onClick(e, module.id, moduleState)}
					linkAddress={`/learn/course/${courseName}/${module.name}`}
				/>
			);
		})}

	</div>
);

export default ModuleChips;
