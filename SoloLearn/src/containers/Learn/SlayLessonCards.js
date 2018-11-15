import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import 'styles/Learn/Lessons.scss';
import { Container, Loading, Title } from 'components/atoms';
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
					<Title>
						{name}
					</Title>
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
