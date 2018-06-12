import React from 'react';
import Progress from 'api/progress';
import CourseChip from 'components/Shared/CourseChip';

const Certificate = ({ modules, courseId }) => {
	const lastModule = modules[modules.length - 1];
	const { progress } = Progress.getModuleState(lastModule);
	const isCourseFinished = progress === 100;
	return (
		<div className="certificate-container">
			<CourseChip
				noBoxShadow
				name="Certificate"
				color="transparent"
				wrapperStyle={{ padding: 0 }}
				disabled={!isCourseFinished}
				customLink={`/certificate/${courseId}`}
				iconUrl={`https://api.sololearn.com/uploads/Modules/certificate${isCourseFinished ? '' : '_disabled'}.png`}
			/>
		</div>
	);
};

export default Certificate;
