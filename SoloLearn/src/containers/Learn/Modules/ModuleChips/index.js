import React from 'react';
import { Container } from 'components/atoms';
import { toSeoFriendly, EnumNameMapper } from 'utils';
import { AppDefaults } from 'api/service';
import Progress, { ProgressState } from 'api/progress';

import ModuleChip from './ModuleChip';
import './styles.scss';

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
	alias,
}) => (
	<Container className="modules-chips-container">
		{modules.map((module) => {
			const moduleState = Progress.getModuleState(module);
			const alignmentClass = ModuleAlignment.getName(module.alignment);
			const completionPercent = Progress.getModuleProgress(module);
			const { stateClass } = moduleState;
			const iconSource =
					`${AppDefaults.downloadHost}/Modules/${courseId}/${module.id}${moduleState.visualState === ProgressState.Disabled ? '_disabled' : ''}.png`;

			return (
				<ModuleChip
					key={module.id}
					state={stateClass}
					name={module.name}
					iconSource={iconSource}
					className={alignmentClass}
					completionPercent={completionPercent}
					onClick={e => onClick(e, module.id, moduleState)}
					to={moduleState.visualState === ProgressState.Disabled ? null : `/learn/course/${toSeoFriendly(alias)}/${toSeoFriendly(module.name)}`}
				/>
			);
		})}

	</Container>
);

export default ModuleChips;
