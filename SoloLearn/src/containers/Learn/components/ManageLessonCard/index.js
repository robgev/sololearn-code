import React from 'react';

import { Container, FlexBox, Progress } from 'components/atoms';
import { RoundImage, IconMenu } from 'components/molecules';

import './styles.scss';

const ManageLessonCard = (props) => (
		<FlexBox fullWidth align className="manage-lesson-card">
			<Container>
				<RoundImage
					src={props.iconUrl}
					classes={{ root: 'manage-course-chip' }}
				/>
			</Container>
			<FlexBox column fullWidth className="lesson-text-content">
				<Container>{ props.name }</Container>
				<Container className="secondary-text">
					{
						props.progress === undefined
							? props.learners
							: <Progress value={props.progress * 100} />
					}
				</Container>
			</FlexBox>
			<Container>
				<IconMenu>
					{props.actions}
				</IconMenu>
			</Container>
		</FlexBox>
	);

export default ManageLessonCard;
