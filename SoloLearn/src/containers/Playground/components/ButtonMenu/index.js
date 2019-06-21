import React from 'react';
import { FlexBox, TextBlock } from 'components/atoms';
import './styles.scss';

const ButtonMenu = ({ blocks, value, onChange }) => (
	<FlexBox justifyBetween className="codes_button-menu">
		{blocks.map(block => (
			<TextBlock
				className={`block ${value === block.value ? 'active' : ''}`}
				onClick={() => onChange(block.value)}
			>
				{block.text}
			</TextBlock>
		))}
	</FlexBox>
);

export default ButtonMenu;
