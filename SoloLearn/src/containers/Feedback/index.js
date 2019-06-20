import React, { useState } from 'react';
import { translate } from 'react-i18next';
import {
	 Popup,
	PopupTitle,
	PopupContent,
	PopupActions,
	Container,
	FlexBox,
	TextBlock,
	MenuItem,
	Select,
	Input,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';
import { feedbackTypes } from 'constants/FeedbackTypes';
import { sendFeedback } from './feedback.api';

import './styles.scss';

const Feedback = ({ openFeedback, toggleFeedback, t }) => {
	const [ value, selectValue ] = useState(feedbackTypes[0]);
	const [ inputValue, changeInputValue ] = useState('');
	const changeType = (e) => {
		selectValue(e.target.value);
	};
	const changeInput = (e) => {
		changeInputValue(e.target.value);
	};

	return (
		<Popup
			open={openFeedback}
			onClose={toggleFeedback}
		>
			<PopupTitle>{t('feedback.title')}</PopupTitle>
			<PopupContent>
				<Container>
					<FlexBox justifyBetween>
						<TextBlock>{t('feedback.filter-section-title')}: </TextBlock>
						<Select
							value={value}
							onChange={changeType}
						>
							{
								feedbackTypes.map(i =>
									<MenuItem key={i} value={i}>{t(`feedback.type.${i}`)}</MenuItem>)
							}
						</Select>
					</FlexBox>
					<Input
						autoFocus
						value={inputValue}
						onChange={changeInput}
						className="feedback-input"
						placeholder={t('feedback.message-placeholder')}
					/>
				</Container>
			</PopupContent>
			<PopupActions>
				<FlatButton onClick={toggleFeedback}>
					{t('common.cancel-title')}
				</FlatButton>
				<FlatButton onClick={() => sendFeedback(value, inputValue)} disabled={inputValue === ''}>
					{t('feedback.send-item-title')}
				</FlatButton>
			</PopupActions>
		</Popup>);
};

export default translate()(Feedback);
