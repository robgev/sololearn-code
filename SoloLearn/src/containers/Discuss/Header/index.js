import React from 'react';

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
import './styles.scss';
import { Search, Add } from 'components/icons';

const Header = ({ searchQuestion, onSearchChange }) => (
	<PaperContainer className="header-container">
		<FlexBox fullWidth justifyBetween>
			<Input
				onChange={onSearchChange}
				fullWidth
				className="search"
				placeholder="Search for a question or answer"
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end" className="search-icon">
							<Search onClick={searchQuestion} />
						</InputAdornment>
					),
					classes: { underline: 'adornmentEnd' },
				}}
				inputProps={{
					className: 'search_input',
				}}
			/>
			<RaisedButton
				color="primary"
				className="add-question-btn"
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
		</FlexBox>
	</PaperContainer>
);

export default Header;
