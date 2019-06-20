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
	FlatButton,
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
			<FlatButton className="add-question-btn">
				<Container className="add-icon">
					<Add />
				</Container>
				<TextBlock className="button-text">
				 	Ask a Question
				</TextBlock>
			</FlatButton>
		</FlexBox>
	</PaperContainer>
);

export default Header;
