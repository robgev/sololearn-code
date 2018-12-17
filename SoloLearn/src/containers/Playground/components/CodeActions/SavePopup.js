import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
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
		console.log('Here');
		browserHistory.replace({
			pathname: `/playground/${this.props.playground.data.publicID}`,
			query: { language: this.props.playground.language },
		});
	}

	onToggle = () => {
		this.setState(({ isPublic }) => ({ isPublic: !isPublic }));
	}

	onChange = (e) => {
		if (e.target.value.length <= 100) {
			this.setState({ name: e.target.value, hasError: !e.target.value.trim() });
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
						onClick={this.onClose}
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
