import React from 'react';
import BusyWrapper from 'components/Shared/BusyWrapper';
import CircularProgress from 'material-ui/CircularProgress';

import 'styles/lessonLayout.scss';

const LessonLayout = ({
	loading,
	children,
}) => (
	<div className="slay-container">
		<div className="main-content">
			<BusyWrapper
				isBusy={loading}
				style={{ minHeight: '60vh' }}
				wrapperClassName="lesson-wrapper"
				loadingComponent={
					<CircularProgress
						size={100}
					/>
				}
			>
				{children}
			</BusyWrapper>
		</div>
		<div className="sidebar" />
	</div>
);

export default LessonLayout;
