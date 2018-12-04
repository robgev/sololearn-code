import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import './Lessons.scss';
import { Title } from 'components/atoms';
import { LessonTiles } from './components';

const SlayLessonCards = ({
	t,
	name,
	lessons,
}) => (
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
);

export default translate()(SlayLessonCards);
