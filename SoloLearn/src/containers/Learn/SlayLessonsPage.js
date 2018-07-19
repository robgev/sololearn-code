import React from 'react';
import { translate } from 'react-i18next';
import CircularProgress from 'material-ui/CircularProgress';
import Layout from 'components/Layouts/GeneralLayout';
import BusyWrapper from 'components/BusyWrapper';

import 'styles/Learn/Lessons.scss';
import LessonTiles from './LessonTiles';

const SlayLessonCards = ({
	t,
	name,
	lessons,
	loading,
}) => (

	<Layout>
		<BusyWrapper
			paper
			isBusy={loading}
			style={{
				padding: 15,
				minHeight: '60vh',
				alignItems: 'initial',
			}}
			wrapperClassName="lessons-container"
			loadingComponent={
				<CircularProgress
					size={100}
				/>
			}
		>
			<div className="lesson-breadcrumbs">
				{name}
			</div>
			<LessonTiles
				t={t}
				slayLessons
				lessons={lessons}
			/>
		</BusyWrapper>
	</Layout>
);

export default translate()(SlayLessonCards);
