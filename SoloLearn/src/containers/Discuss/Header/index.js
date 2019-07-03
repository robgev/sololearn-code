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
	ContainerLink,
} from 'components/molecules';
import './styles.scss';
import { Search, Add } from 'components/icons';

const Header = ({
	searchQuestion, onSearchChange, enterKeyPress, query,
}) => (
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
			<ContainerLink to="/discuss/new" className="ask-question-button-container">
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
			</ContainerLink>
		</FlexBox>
	</PaperContainer>
);

export default Header;
