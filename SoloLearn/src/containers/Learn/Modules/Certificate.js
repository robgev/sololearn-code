import React from 'react';
import Progress from 'api/progress';
import { translate } from 'react-i18next';
import CourseChip from 'components/CourseChip';

const Certificate = ({ t, modules, courseId }) => {
	const lastModule = modules[modules.length - 1];
	const { progress } = Progress.getModuleState(lastModule);
	const isCourseFinished = progress === 100;
	return (
		<div className="certificate-container">
			<CourseChip
				round
				noBoxShadow
				color="transparent"
				paperStyle={{ width: 95 }}
				name={t('certificate.title')}
				wrapperStyle={{ padding: 0 }}
				disabled={!isCourseFinished}
				customLink={`/certificate/${courseId}`}
				iconUrl={`/assets/certificate${isCourseFinished ? '' : '_disabled'}.png`}
			/>
		</div>
	);
};

export default translate()(Certificate);
