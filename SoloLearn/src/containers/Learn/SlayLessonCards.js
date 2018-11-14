import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import 'styles/Learn/Lessons.scss';
import { Container, Loading } from 'components/atoms';
import { LayoutWithSidebar } from 'components/molecules';
import { LessonTiles, UserProgressToolbar } from './components';

const SlayLessonCards = ({
	t,
	name,
	lessons,
	loading,
}) => (

	<LayoutWithSidebar
		sidebar={<UserProgressToolbar />}
	>
		{ loading
			? <Loading />
			: (
				<Fragment>
					<Container className="lesson-breadcrumbs">
						{name}
					</Container>
					<LessonTiles
						t={t}
						slayLessons
						lessons={lessons}
					/>
				</Fragment>
			)
		}
	</LayoutWithSidebar>
);

export default translate()(SlayLessonCards);
