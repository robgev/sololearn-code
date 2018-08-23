import React from 'react';
import Sidebar from 'components/Sidebar';
import BusyWrapper from 'components/BusyWrapper';
import CircularProgress from 'material-ui/CircularProgress';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';

import 'styles/lessonLayout.scss';

const LessonLayout = ({
	loading,
	children,
	sidebarContent,
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
		<Sidebar>
			{ loading
				? <SidebarShimmer />
				: sidebarContent
			}
		</Sidebar>
	</div>
);

export default LessonLayout;
