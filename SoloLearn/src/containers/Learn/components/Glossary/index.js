import React from 'react';

import {
	Popup,
	Loading,
	Container,
	PopupTitle,
	TextBlock,
	Title,
	SecondaryTextBlock,
} from 'components/atoms';

import './styles.scss';

const Glossary = ({
	open, onClose, content, courseName,
}) => (<Popup
	classes={{
		paper: 'glossaryPopup',

	}}
	open={open}
	onClose={onClose}
>
	<PopupTitle>{courseName}</PopupTitle>
	{
		content
			? content.map(group =>
				(
					<Container className="groupContainer">
						<Title>{group.name}</Title>
						{
							group.terms.map(term =>
								(<Container className="termContainer">
									<TextBlock className="glossaryTerm">
										{term.term}
									</TextBlock>
									<br />
									<SecondaryTextBlock>
										{term.text}
									</SecondaryTextBlock>
								</Container>))
						}
					</Container>
						   ))
			: <Loading />
	}
</Popup>);

export default Glossary;
