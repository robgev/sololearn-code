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
import { Search, Add } from 'components/icons';
import './styles.scss';

const Header = ({ value, searchCodes, onSearchChange }) => (
	<PaperContainer className="header-container">
		<FlexBox fullWidth justifyBetween>
			<Input
				onChange={onSearchChange}
				value={value}
				fullWidth
				className="search"
				placeholder="Search code"
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end" className="search-icon">
							<Container onClick={searchCodes}>
								<Search />
							</Container>
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
				className="add-codes-btn"
			>
				<FlexBox align justify fullWidth>
					<Container className="add-icon">
						<Add />
					</Container>
					<TextBlock className="button-text">
						Create New Code
					</TextBlock>
				</FlexBox>
			</RaisedButton>
		</FlexBox>
	</PaperContainer>
);

export default Header;
