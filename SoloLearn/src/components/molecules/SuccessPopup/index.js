import React from 'react';
import {
	Popup,
	Title,
	Button,
	FlexBox,
} from 'components/atoms';
import { CheckCircle } from 'components/icons';

import './styles.scss';

const SuccessPopup = ({
	open,
	text,
	onClose,
}) => (
	<Popup open={open} onClose={onClose}>
		<FlexBox justify align column className="success-popup-molecul-container">
			<CheckCircle className="success-popup-molecul-icon" />
			<Title className="success-popup-molecul-text">{text}</Title>
			<Button onClick={onClose}>OK</Button>
		</FlexBox>
	</Popup>
);

export default SuccessPopup;
