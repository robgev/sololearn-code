import React from 'react';
import Progress from 'api/progress';
import { Container } from 'components/atoms';
import CertificateChip from '../components/CertificateChip';

const Certificate = ({ modules, courseId }) => {
	const lastModule = modules[modules.length - 1];
	const { progress } = Progress.getModuleState(lastModule);
	const isCourseFinished = progress === 100;
	return (
		<Container className="certificate-container module-line-container">
			<CertificateChip
				id={courseId}
				isFinished={isCourseFinished}
			/>
		</Container>
	);
};

export default Certificate;
