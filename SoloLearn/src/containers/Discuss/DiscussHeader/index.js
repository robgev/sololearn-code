import React, { Fragment, useState } from 'react';

import {
	PaperContainer,
	FlexBox,
	Input,
	TextBlock,
	InputAdornment,
	Container,
} from 'components/atoms';
import {
	RaisedButton,
} from 'components/molecules';
import { Search, Add } from 'components/icons';

import { createQuestion } from '../discuss.api';

import QuestionEditor from '../QuestionEditor';

import './styles.scss';

const DiscussHeader = ({
	searchQuestion,
	onSearchChange,
	enterKeyPress,
	query,
	canAddQuestion,
}) => {
	const [ editMode, setEditMode ] = useState(false);
	const handleAskButton = () => {
		if (canAddQuestion()) {
			setEditMode(true);
		}
	};
	return (
		<Fragment>
			{!editMode ?
				(
					<PaperContainer className="header-container">
						<FlexBox fullWidth justifyBetween>
							<Input
								value={query}
								onChange={onSearchChange}
								onKeyDown={enterKeyPress}
								fullWidth
								className="search"
								placeholder="Search for a question or answer"
								variant="outlined"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end" className="search-icon" onClick={searchQuestion}>
											<Search />
										</InputAdornment>
									),
									classes: { underline: 'adornmentEnd' },
								}}
								inputProps={{
									className: 'search_input',
								}}
							/>
							<Container className="ask-question-button-container">
								<RaisedButton
									color="primary"
									className="add-question-btn"
									onClick={handleAskButton}
								>
									<FlexBox align justify fullWidth>
										<Container className="add-icon">
											<Add />
										</Container>
										<TextBlock className="button-text">
											Ask a Question
										</TextBlock>
									</FlexBox>
								</RaisedButton>
							</Container>
						</FlexBox>
					</PaperContainer>
				)
				: <QuestionEditor
					isNew
					handleCancel={() => setEditMode(false)}
					submit={createQuestion}
				/>
			}
		</Fragment>
	);
};

export default DiscussHeader;
