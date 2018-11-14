import React from 'react';
import { ContainerLink, FloatingActionButton } from 'components/molecules';
import { Add } from 'components/icons';

const AddQuestionButton = () => (
	<ContainerLink to="/discuss/new">
		<FloatingActionButton alignment="right">
			<Add />
		</FloatingActionButton>
	</ContainerLink>
);

export default AddQuestionButton;
