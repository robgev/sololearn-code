import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import Dialog from 'components/StyledDialog';
import {
	FlexBox,
	RadioButton,
	Input,
	SecondaryTextBlock,
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	PopupActions,
} from 'components/atoms';
import { RadioButtonGroup, FlatButton } from 'components/molecules';
import Service from 'api/service';

import './DeactivationPopup.scss';

@translate()
class ReportPopup extends PureComponent {
	constructor() {
		super();
		this.customReasonMaxLength = 256;
		this.state = {
			reportReason: 11,
			customReason: '',
		};
	}

	handleReasonChange = (event) => {
		this.setState({ reportReason: +event.target.value });
	}

	handleCustomReasonChange = (event) => {
		const customReason = event.target.value;
		if (customReason.length <= this.customReasonMaxLength) {
			this.setState({ customReason });
		}
	}

	submitReport = async () => {
		const {
			itemType,
			accessLevel,
			onRequestClose,
			reportedUserId,
		} = this.props;
		const { reportReason, customReason } = this.state;
		try {
			this.setState({
				reportReason: 11,
				customReason: '',
			});
			onRequestClose();
			if (accessLevel > 1) {
				await Service.request('Profile/DeactivateUser', {
					reason: reportReason,
					userId: reportedUserId,
					message: customReason,
				});
			} else {
				await Service.request('ReportItem', {
					itemType,
					reason: reportReason,
					message: customReason,
					itemId: reportedUserId,
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const { reportReason, customReason } = this.state;
		const { onRequestClose, open, t } = this.props;
		const actions = [
			<FlatButton
				color="primary"
				onClick={onRequestClose}
			>
				{t('common.cancel-title')}
			</FlatButton>,
			<FlatButton
				color="primary"
				onClick={() => this.submitReport()}
			>
				{t('common.deactivate-action-title')}
			</FlatButton>,
		];
		return (
			<Popup
				open={open}
				onClose={onRequestClose}
				className="profile-deactivate-popup"
			>
				<PopupTitle>
					{t('deactivate.deactivate-popup-title')}
				</PopupTitle>
				<PopupContent>
					<RadioButtonGroup
						name="deactivateReason"
						value={reportReason}
						onChange={this.handleReasonChange}
					>
						<RadioButton
							value={11}
							label={t('deactivate.deactivate-option-1')}
						/>
						<RadioButton
							value={12}
							label={t('deactivate.deactivate-option-2')}
						/>
						<RadioButton
							value={13}
							label={t('deactivate.deactivate-option-3')}
						/>
						<RadioButton
							value={14}
							label={t('deactivate.deactivate-option-4')}
						/>
						<RadioButton
							value={0}
							label={t('deactivate.deactivate-option-5')}
						/>
					</RadioButtonGroup>
					{reportReason === 0 &&
						<FlexBox column>
							<Input
								value={customReason}
								onChange={this.handleCustomReasonChange}
								inputProps={{ maxLength: this.customReasonMaxLength }}
								label={t('common.report-more-hint')}
							/>
							<SecondaryTextBlock className="count">{customReason.length} / {this.customReasonMaxLength}</SecondaryTextBlock>
						</FlexBox>
					}
				</PopupContent>
				<PopupActions>
					{actions}
				</PopupActions>
			</Popup>
		);
	}
}

export default ReportPopup;
