import React from 'react';
import { translate } from 'react-i18next';

import { Container, FlexBox, Progress } from 'components/atoms';
import { RoundImage, IconMenu } from 'components/molecules';
import { numberFormatter } from 'utils';

import './styles.scss';

const ManageLessonCard = ({ 
iconUrl, name, learners, progress, actions, t 
}) => (
	<FlexBox fullWidth align className="manage-lesson-card">
		<Container>
			<RoundImage
				src={iconUrl}
				classes={{ root: 'manage-course-chip' }}
			/>
		</Container>
		<FlexBox column fullWidth className="lesson-text-content">
			<Container>{ name }</Container>
			<Container className="secondary-text">
				{
					progress === undefined
						? `${numberFormatter(learners)} ${t('learn.course-learners-format')}`
						: <Progress value={progress * 100} />
				}
			</Container>
		</FlexBox>
		<Container>
			<IconMenu>
				{actions}
			</IconMenu>
		</Container>
	</FlexBox>
);

export default translate()(ManageLessonCard);
