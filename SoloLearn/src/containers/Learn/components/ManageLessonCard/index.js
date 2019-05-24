import React from 'react';
import { translate } from 'react-i18next';

import { Container, FlexBox, Progress } from 'components/atoms';
import { RoundImage, IconMenu, ContainerLink } from 'components/molecules';
import { numberFormatter } from 'utils';

import './styles.scss';

const ManageLessonCard = ({
	iconUrl, name, learners, progress, actions, url, t, addCourse,
}) => (
	<FlexBox fullWidth align className="manage-lesson-card">
		<ContainerLink className="manage-lesson-card-link-container" to={url}>
			<FlexBox fullWidth align onClick={addCourse}>
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
			</FlexBox>
		</ContainerLink>
		<Container>
			<IconMenu>
				{actions}
			</IconMenu>
		</Container>
	</FlexBox>
);

ManageLessonCard.defaultProps = {
	addCourse: () => {},
};

export default translate()(ManageLessonCard);
