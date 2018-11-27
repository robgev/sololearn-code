import React, { Component } from 'react';
import { translate } from 'react-i18next';
import {
	Input,
	FlexBox,
	Popup,
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
	SecondaryTextBlock,
	SwitchToggle,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';

@translate()
class SavePopup extends Component {
	state = {
		name: '',
		isPublic: false,
		hasError: false,
	}

	onConfirm = () => {
		const { name, isPublic } = this.state;
		this.props.playground.saveCode({ name, isPublic });
		this.props.onClose();
	}

	onToggle = () => {
		this.setState(({ isPublic }) => ({ isPublic: !isPublic }));
	}

	onChange = (e) => {
		if (this.state.name.length < 100) {
			this.setState({ name: e.target.value, hasError: Boolean(e.target.value.trim()) });
		}
	}

	render() {
		const {
			t,
			open,
			onClose,
		} = this.props;
		const { name, hasError } = this.state;
		return (
			<Popup
				open={open}
				onClose={onClose}
			>
				<PopupTitle>{t('code_playground.popups.save-popup-title')}</PopupTitle>
				<PopupContent>
					<PopupContentText>{t('code_playground.popups.save-popup-code-name-placeholder')}</PopupContentText>
					<Input
						fullWidth
						value={name}
						error={hasError}
						onChange={this.onChange}
						label={t('code_playground.popups.save-popup-code-name-placeholder')}
					/>
					<FlexBox align justifyBetween>
						<SecondaryTextBlock>{name.length}/100</SecondaryTextBlock>
						<SwitchToggle
							onChange={this.onToggle}
							defaultChecked={this.props.playground.isPublic}
							labelPlacement="start"
							label={t('code_playground.popups.save-popup-public-toggle-title')}
						/>
					</FlexBox>
				</PopupContent>
				<PopupActions>
					<FlatButton
						onClick={onClose}
						variant="secondary"
					>
						{t('common.cancel-title')}
					</FlatButton>
					<FlatButton
						variant="primary"
						disabled={!name.trim()}
						onClick={this.onConfirm}
					>
						{t('common.submit-action-title')}
					</FlatButton>
				</PopupActions>
			</Popup>
		);
	}
}

export default SavePopup;
