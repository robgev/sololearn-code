import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
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
@observer
class SavePopup extends Component {
	state = {
		name: '',
		isPublic: false,
		hasError: false,
	}

	onConfirm = async () => {
		const { name, isPublic } = this.state;
		this.setState({ name: '', isPublic: false, hasError: false });
		this.props.onClose();
		await this.props.playground.saveNewCode({ name, isPublic });
		browserHistory.replace({
			pathname: `/playground/${this.props.playground.data.publicID}`,
			query: { language: this.props.playground.language },
		});
	}

	onToggle = () => {
		this.setState(({ isPublic }) => ({ isPublic: !isPublic }));
	}

	onChange = (e) => {
		if (e.target.value.length <= this.props.playground.MAX_INPUT_LENGTH) {
			this.setState({ name: e.target.value, hasError: !e.target.value.trim() });
		} else {
			const trimmedValue = e.target.value.substring(0, this.props.playground.MAX_INPUT_LENGTH);
			this.setState({ name: trimmedValue, hasError: !trimmedValue.trim() });
		}
	}

	onClose = () => {
		this.setState({ name: '', isPublic: false, hasError: false });
		this.props.onClose();
	}

	render() {
		const {
			t,
			open,
		} = this.props;
		const { name, hasError } = this.state;
		return (
			<Popup
				open={open}
				onClose={this.onClose}
			>
				<PopupTitle>{t('code_playground.popups.save-popup-title')}</PopupTitle>
				<PopupContent>
					<Input
						fullWidth
						value={name}
						error={hasError}
						onChange={this.onChange}
						label={t('code_playground.popups.save-popup-code-name-placeholder')}
					/>
					<FlexBox align justifyBetween>
						<SecondaryTextBlock>
							{name.length}/{this.props.playground.MAX_INPUT_LENGTH}
						</SecondaryTextBlock>
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
						onClick={this.onClose}
					>
						{t('common.cancel-title')}
					</FlatButton>
					<FlatButton
						color="primary"
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
