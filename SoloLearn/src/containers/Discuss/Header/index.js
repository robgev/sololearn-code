import React, { useState } from 'react';

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
	ContainerLink,
} from 'components/molecules';
import './styles.scss';
import { Search, Add } from 'components/icons';

import NewQuestion from '../NewQuestion';

const Header = ({
	searchQuestion, onSearchChange, enterKeyPress, query, canAddQuestion,
}) => {
	const [ editMode, setEditMode ] = useState(false);
	const handleSubmit = () => {
		if (canAddQuestion()) {
			setEditMode(true);
		}
	};
	return (
		<React.Fragment>
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
									onClick={handleSubmit}
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
				: <NewQuestion handleCancel={() => setEditMode(false)} />
			}

		</React.Fragment>
	);
};

export default Header;
