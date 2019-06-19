import React from 'react';

import {
	PaperContainer,
	FlexBox,
	Input,
	TextBlock,
	InputAdornment,
} from 'components/atoms';
import {
	FlatButton,
} from 'components/molecules';
import './styles.scss';
import { SearchBtn } from 'components/icons';

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
							<SearchBtn onClick={searchQuestion} />
						</InputAdornment>
					),
				}}
				inputProps={{
					className: 'search_input',
				}}
			/>
			<FlatButton className="add-question-btn">
				<img className="add-icon" src="/assets/ic_add.png" alt="add_icon" />
				<TextBlock>
				 Ask a Question
				</TextBlock>
			</FlatButton>
		</FlexBox>
	</PaperContainer>
);

export default Header;
